/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2024, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/
const {
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const unzipper = require("unzipper");
const archiver = require("archiver");
const stream = require("stream");
const nodePath = require("path");
const {
  escapePath,
  checkExtension,
  checkVariables,
} = require("../utilits/filemanager");
const { Buffer } = require("buffer"); // Import Buffer to handle base64 and binary data
const AppError = require("../utilits/appError");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Convert common prefixes to folder structure
const convertCommonPrefixes = (commonPrefixes = []) => {
  return commonPrefixes.map((dir) => ({
    path: dir.Prefix,
    name: (dir.Prefix.match(/([^/]+)\/$/) || [])[1],
    created: "",
    modified: "",
    id: dir.Prefix + Date.now(),
    type: "folder",
    children: [],
    size: 0,
    private: false,
  }));
};

const convertContents = (contents) => {
  if (!Array.isArray(contents)) {
    return [];
  }
  return contents?.reduce((result, file) => {
    const path = file.Key;
    const match = path.match(/([^/]+)\.([^./]+)$/);

    // If match is null or undefined, skip this file
    if (!match || !match[2]) {
      return result;
    }

    const fileNameWithExt = match[0];
    const extension = `.${match[2]}`;

    result.push({
      path,
      name: fileNameWithExt,
      created: String(file.LastModified || ""),
      modified: String(file.LastModified || ""),
      id: fileNameWithExt,
      type: "file",
      size: file.Size || 0,
      private: false,
      extension,
    });

    return result;
  }, []);
};

// Helper function to remove the last segment of a path and get the new path
function removeLastSegment(path) {
  const trimmedPath = path.replace(/\/+$/, ""); // Remove trailing slashes
  const segments = trimmedPath.split("/");
  segments.pop(); // Remove the last segment (file or folder name)

  // Return the base path; add a trailing slash if not empty
  // eslint-disable-next-line prefer-template
  return segments.length > 0 ? segments.join("/") + "/" : "";
}

function generateCopyName(originalName) {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // Timestamp without special characters
  const nameParts = originalName.split("."); // Separate name and extension

  if (nameParts.length > 1) {
    // File with extension
    const extension = nameParts.pop(); // Remove the extension
    return `${nameParts.join(".")}_copy_${timestamp}.${extension}`; // Add _copy and timestamp before the extension
  }
  // Folder or file without extension
  return `${originalName}_copy_${timestamp}`; // Add _copy and timestamp
}

// Helper function to determine content type based on file extension
function getContentTypeByFile(fileName) {
  const extension = fileName.split(".").pop();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    txt: "text/plain",
    pdf: "application/pdf",
    html: "text/html",
    json: "application/json",
    zip: "application/zip",
  };
  return mimeTypes[extension] || "application/octet-stream";
}

class S3Controller {
  constructor(s3Client, bucketName) {
    this.s3Client = s3Client;
    this.bucketName = bucketName;
  }

  // PRIVATE METHODS//
  async deleteObjectsRecursively({
    path,
    continuationToken,
    retries = 0,
    keepRoot = false, // New parameter
  }) {
    const MAX_RETRIES = 10;

    if (retries > MAX_RETRIES) {
      console.error(`Max retries reached for path: ${path}`);
      return;
    }

    try {
      // Step 1: List objects in the folder
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: path,
        ContinuationToken: continuationToken, // For paginated results
      });

      const listResponse = await this.s3Client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        console.log(
          `Directory '${path}' is already empty or there are no more items to delete.`
        );
        return;
      }

      // Step 2: Prepare the list of objects to delete
      let deleteObjects = listResponse.Contents.map((object) => ({
        Key: object.Key,
      }));

      // Step 3: Remove the root folder key from deletion if `keepRoot` is true
      if (keepRoot) {
        deleteObjects = deleteObjects.filter((obj) => obj.Key !== path);
      }

      if (deleteObjects.length > 0) {
        // Step 4: Delete the objects
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: this.bucketName,
          Delete: { Objects: deleteObjects },
        });

        await this.s3Client.send(deleteCommand);
      }

      // Step 5: Recursively call the function for the next set of objects if IsTruncated is true
      if (listResponse.IsTruncated) {
        // Recursively delete the next batch of objects
        await this.deleteObjectsRecursively({
          path,
          continuationToken: listResponse.NextContinuationToken,
          retries: 0, // Reset retries on successful deletion
          keepRoot,
        });
      }
    } catch (error) {
      console.error(
        `Error deleting objects from path '${path}', retrying...`,
        error
      );
      // Retry the operation if there's an error, up to MAX_RETRIES
      await this.deleteObjectsRecursively({
        path,
        continuationToken,
        retries: retries + 1,
        keepRoot,
      });
    }
  }

  async copyFilesToFolder({ items, destination }) {
    const copyPromises = items.map((item) => {
      const fileName = item.match(/[^/]+\/?$/)?.[0] || item;
      return this.s3Client.send(
        new CopyObjectCommand({
          Bucket: this.bucketName,
          Key: `${destination}${fileName}`,
          CopySource: `${this.bucketName}/${item}`,
        })
      );
    });
    return Promise.all(copyPromises);
  }

  async deleteListOfObjectsRecursively({
    pathList,
    continuationToken,
    retries = 0,
    keepRoot = false,
  }) {
    const deletePromises = pathList.map((path) => {
      return this.deleteObjectsRecursively({
        path,
        continuationToken,
        retries,
        keepRoot,
      });
    });
    return Promise.all(deletePromises);
  }

  async uploadToS3Stream(key, fileStream, ContentType) {
    try {
      const parallelUploads3 = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: fileStream,
          ContentType,
        },
      });

      parallelUploads3.on("httpUploadProgress", (progress) => {
        console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
      });

      await parallelUploads3.done();
      console.log(`File uploaded successfully: ${key}`);
    } catch (error) {
      console.error(`Error uploading file ${key}:`, error);
      throw error;
    }
  }

  async getPresignedUrl(filePath) {
    const params = {
      Bucket: this.bucketName,
      Key: filePath, // Path of the file in S3
    };

    try {
      const command = new GetObjectCommand(params);
      // Generate a pre-signed URL valid for 1 hour
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      throw error;
    }
  }

  // Function to get the file stream from S3
  async getFileStream(filePath) {
    const params = {
      Bucket: this.bucketName, // Your S3 bucket name
      Key: filePath, // Path of the file in S3
    };

    try {
      const command = new GetObjectCommand(params);
      const data = await this.s3Client.send(command);
      return data.Body; // Returns a readable stream
    } catch (error) {
      console.error("Error getting file from S3:", error);
      throw error;
    }
  }
  // END PRIVATE METHODS //

  // Recursive function to get the folder tree
  async getFolderTree(bucketName, prefix = "") {
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: "/", // Ensure it fetches only folder structure, not files
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    // Convert the common prefixes (folder names) to folder objects
    const folderList = convertCommonPrefixes(response.CommonPrefixes);

    // Recursively fetch subfolders for each folder
    for (const folder of folderList) {
      const subFolderTree = await this.getFolderTree(bucketName, folder.path);
      folder.children = subFolderTree.children; // Populate the children
    }

    return {
      path: prefix || "/",
      name: prefix ? (prefix.match(/([^/]+)\/$/) || [])[1] : "root",
      created: "null",
      id: String(Date.now()),
      modified: "null",
      type: "folder",
      size: 0,
      children: folderList,
    };
  }

  async folderTree(req, res, next) {
    try {
      const bucketName = req.headers["bucket-name"];

      // Ensure bucket name exists in the headers
      if (!bucketName) {
        return res
          .status(400)
          .send({ error: "Bucket name is required in headers" });
      }

      const prefix = req.query.prefix || ""; // Optional: prefix parameter in query
      const folderTree = await this.getFolderTree(bucketName, prefix);

      res.status(200).send(folderTree);
    } catch (error) {
      console.error("Error fetching folder tree:", error);
      res.status(500).send({ error: "Error fetching folder tree" });
    }
  }

  // API handler to list files and folders in a specific path
  async folderInfo(req, res, next) {
    try {
      const bucketName = req.headers["bucket-name"];
      const { path } = req.body;

      // Ensure bucket name exists in the headers
      if (!bucketName) {
        return res
          .status(400)
          .send({ error: "Bucket name is required in headers" });
      }
      this.bucketName = bucketName;

      const command = new ListObjectsCommand({
        Bucket: this.bucketName,
        Prefix: path === "/" ? "" : path, // Empty string for root
        Delimiter: "/", // To emulate folder structure
      });

      const response = await this.s3Client.send(command);
      const result = [
        ...convertCommonPrefixes(response?.CommonPrefixes),
        ...convertContents(response?.Contents),
      ];
      res.status(200).json({ children: result });
    } catch (error) {
      console.error("Error listing files:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async rename(req, res, next) {
    const bucketName = req.headers["bucket-name"];
    const { path, newname } = req.body;

    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    this.bucketName = bucketName;

    // Step 1: Get the root/base path without the last segment
    const rootPath = removeLastSegment(path); // Base path, minus the last segment

    // Extract the last segment (the current file or folder name), removing any trailing slashes
    const trimmedPath = path.replace(/\/+$/, ""); // Ensure no trailing slashes before splitting
    const oldName = trimmedPath.split("/").pop() || ""; // Extract the last segment

    // Check if oldName is valid
    if (!oldName) {
      console.warn("No valid name found in the path to rename. Aborting.");
      return;
    }

    // Step 2: List all objects that start with the provided path (this could be a file or folder)
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: path, // List all objects under the given path
    });

    const listResponse = await this.s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.warn("No files found at the given path. Aborting rename.");
      return;
    }

    // Determine if it's a file or a folder based on path format
    const isFolder = path.endsWith("/");

    // Step 3: Rename each object
    const copyPromises = listResponse.Contents.map(async (object) => {
      const oldKey = object.Key;
      const remainingPath = oldKey.slice(path.length); // Get the part of the path after the original path

      // If renaming a file, there should be no trailing slash in the new name
      const newKey = isFolder
        ? `${rootPath}${newname}/${remainingPath}`
        : `${rootPath}${newname}${remainingPath}`;

      // Copy each object to the new location (with new name in the path)
      await this.s3Client.send(
        new CopyObjectCommand({
          Bucket: this.bucketName,
          Key: newKey,
          CopySource: `${this.bucketName}/${oldKey}`,
        })
      );
    });

    // Wait for all copy operations to complete
    await Promise.all(copyPromises);

    // Step 4: Only create a new "empty" folder if it's a folder and it's empty
    if (
      isFolder &&
      listResponse.Contents.length === 1 &&
      listResponse.Contents[0].Key === path
    ) {
      // If it's an empty folder, create a new "empty" folder at the new location
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: `${rootPath}${newname}/`, // New empty folder with trailing slash
          Body: "", // Empty object to represent the folder
        })
      );
    }

    // Step 5: Delete the original objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: listResponse.Contents.map((object) => ({ Key: object.Key })),
      },
    });

    await this.s3Client.send(deleteCommand);
    res.status(200).json({
      status: "success",
      message: "File or Folder succesfully renamed!",
    });
  }

  async createFile(req, res, next) {
    const bucketName = req.headers["bucket-name"];
    let { path, file, contentType, fileContent } = req.body;
    path = escapePath(path);
    file = escapePath(file);

    // if (!checkExtension(path.extname(file))) {
    //   return next(new AppError(`Wrong File Format ${file}`, 400));
    // }
    if (!checkVariables([path, file])) {
      return next(new AppError("Variables not seted!", 400));
    }
    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    this.bucketName = bucketName;
    try {
      // Ensure path is properly formatted (no leading/trailing slashes)
      let normalizedPath = path.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes
      const fullFilePath = `${normalizedPath}/${file}`; // Combine path and file name

      // Handle file content (assuming fileContent is base64 encoded or a binary buffer)
      let fileBuffer;
      if (fileContent) {
        if (
          typeof fileContent === "string" &&
          fileContent.startsWith("data:")
        ) {
          // If the file content is base64 encoded with a data URL, extract the base64 part
          const base64Data = fileContent.split(",")[1];
          fileBuffer = Buffer.from(base64Data, "base64");
        } else {
          // If the fileContent is binary buffer data
          fileBuffer = Buffer.isBuffer(fileContent)
            ? fileContent
            : Buffer.from(fileContent, "binary");
        }
      } else {
        fileBuffer = "";
      }

      // Create the S3 PutObjectCommand
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fullFilePath, // Full path to the file in S3
        Body: fileBuffer, // File content as buffer
        ContentType: contentType || "application/octet-stream", // Optional content type
      });

      // Upload the file
      const uploadResponse = await this.s3Client.send(command);
      res.status(200).json({
        status: "success",
        message: "File or Folder succesfully renamed!",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send({ error: "Error uploading file" });
    }
  }

  async createFolder(req, res, next) {
    let { path, folder, mask } = req.body;
    let normalizedPath = path.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes
    const Key = `${normalizedPath}/${folder}/`; // Combine path and file name

    const bucketName = req.headers["bucket-name"];
    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }

    this.bucketName = bucketName;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key, // Create "folder" with a trailing slash
      Body: "",
    });
    await this.s3Client.send(command);
    res.status(200).json({
      status: "success",
      message: "Folder succesfully created!",
    });
  }

  async delete(req, res, next) {
    const { items } = req.body;
    const bucketName = req.headers["bucket-name"];
    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    try {
      const deletePromises = items.map((path) =>
        this.deleteObjectsRecursively({ path, keepRoot: false })
      );
      await Promise.all(deletePromises);
      res.status(200).json({
        status: "success",
        message: "File or folder succesfully deleted!",
      });
    } catch (error) {
      return next(new AppError(error?.message, 400));
    }
  }

  async copy(req, res, next) {
    const { items, destination } = req.body;
    const bucketName = req.headers["bucket-name"];
    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    try {
      await this.copyFilesToFolder({ items, destination });
      res.status(200).json({
        status: "success",
        message: "Files or folders succesfully copied!",
      });
    } catch (error) {
      return next(new AppError(error?.message, 400));
    }
  }

  async move(req, res, next) {
    const { items, destination } = req.body;
    const bucketName = req.headers["bucket-name"];
    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    try {
      await this.copyFilesToFolder({ items, destination });
      await this.deleteListOfObjectsRecursively({ pathList: items });

      res.status(200).json({
        status: "success",
        message: "Files or folders succesfully moved!",
      });
    } catch (error) {
      return next(new AppError(error?.message, 400));
    }
  }

  async duplicateFile(req, res, next) {
    const { path } = req.body;
    const bucketName = req.headers["bucket-name"];
    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    this.bucketName = bucketName;

    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: path, // List all objects under the given path
      });

      const listResponse = await this.s3Client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        console.log("No items found at the given path. Aborting duplication.");
        return;
      }

      const isFolder = path.endsWith("/");

      // Step 2: Generate the new name for the first item (folder or file)
      const trimmedPath = path.replace(/\/+$/, ""); // Remove trailing slashes to handle folders
      const lastSegment = trimmedPath.split("/").pop(); // Get the last segment (file/folder name)
      const newName = generateCopyName(lastSegment); // Generate new name with _copy and timestamp

      const rootPath = path.replace(lastSegment, ""); // Get the root path (parent directory)
      const newRootPath = isFolder
        ? `${rootPath}${newName}/`
        : `${rootPath}${newName}`; // New folder or file path

      // Step 3: Copy all items under the original path to the new location
      const copyPromises = listResponse.Contents.map(async (object) => {
        const oldKey = object.Key;
        const relativePath = oldKey.slice(path.length); // Get the part of the path after the original path

        // For the root item, we add _copy; for child items, retain the original relative path
        const newKey = isFolder
          ? `${newRootPath}${relativePath}` // Keep child structure intact for folders
          : newRootPath; // Direct copy for files

        // Copy each object to the new location
        await this.s3Client.send(
          new CopyObjectCommand({
            Bucket: this.bucketName,
            Key: newKey,
            CopySource: `${this.bucketName}/${oldKey}`,
          })
        );
      });

      // Wait for all copy operations to complete
      await Promise.all(copyPromises);

      res.status(200).json({
        status: "success",
        message: "Files or folders succesfully duplicated!",
      });
    } catch (error) {
      return next(new AppError(error?.message, 400));
    }
  }

  async emptydir(req, res, next) {
    const { path } = req.body;
    const bucketName = req.headers["bucket-name"];
    // Ensure bucket name exists in the headers
    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    this.bucketName = bucketName;
    if (!path.endsWith("/")) {
      return next(
        new AppError(
          "The provided path is not a folder. Path must end with a trailing slash.",
          400
        )
      );
    }
    try {
      await this.deleteObjectsRecursively({ path, keepRoot: true });

      res.status(200).json({
        status: "success",
        message: "Files or folders succesfully duplicated!",
      });
    } catch (error) {
      return next(new AppError(error?.message, 400));
    }
  }

  // Method to upload multiple files to S3
  async uploadFiles(req, res, next) {
    try {
      const bucketName = req.headers["bucket-name"];
      const path = req.body.path || ""; // Folder path if any
      const fileMaps = req.body.fileMaps;
      const files = req.files; // Array of uploaded files from multer
      let pathMappings = null;

      // Parse fileMaps if provided
      if (fileMaps) {
        pathMappings = JSON.parse(fileMaps) ?? [];
      }
      if (!bucketName || !files || files.length === 0) {
        return res
          .status(400)
          .send({ error: "Bucket name and files are required" });
      }
      this.bucketName = bucketName;

      // Normalize the path
      const normalizedPath = path.replace(/^\/+|\/+$/g, "");

      // Create an array of promises for each file upload
      const uploadPromises = files.map((file) => {
        const relativePath = pathMappings.find((currFile) => currFile?.name === file.originalname)?.path ?? `/${file.originalname}`;
        const fullFilePath = `${
          normalizedPath ? normalizedPath : ""
        }${relativePath}`;

        // Create the S3 PutObjectCommand for each file
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fullFilePath,
          Body: file.buffer, // File content as buffer
          ContentType: file.mimetype, // Use file's mimetype
        });

        // Return the promise from sending the command
        return this.s3Client.send(command).then((uploadResponse) => ({
          fileName: file.originalname,
          uploadResponse,
        }));
      });

      // Wait for all uploads to complete
      const uploadResponses = await Promise.all(uploadPromises);

      res.status(200).json({
        status: "success",
        message: `Files uploaded successfully to ${normalizedPath || "/"}`,
        uploadResponses,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).send({ error: "Error uploading files" });
    }
  }

  async unzipFile(req, res, next) {
    try {
      const bucketName = req.headers["bucket-name"];
      const archivePath = req.body.file; // Path to the ZIP file in S3
      const uploadDirectory = req.body.destination; // Path to the ZIP file in S3

      if (!bucketName || !archivePath) {
        return res
          .status(400)
          .send({ error: "Bucket name and ZIP file path are required" });
      }

      // Set the bucket name
      this.bucketName = bucketName;

      const zipFileStream = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: archivePath,
        })
      );
      console.log("this.bucketName", this.bucketName);
      // Step 2: Pipe the S3 file stream into unzipper to extract its contents
      const unzipStream = zipFileStream.Body.pipe(unzipper.Parse());
      unzipStream.on("error", (err) => {
        console.error("Error during unzip stream:", err);
        throw err;
      });
      unzipStream.on("close", () => {
        console.log("Unzip stream has closed successfully.");
      });

      // Step 3: Iterate through each entry (file or folder) inside the ZIP file
      unzipStream.on("entry", async (entry) => {
        const fileName = entry.path;
        const filePath = `${uploadDirectory}${fileName}`; // Full path for the file in S3
        if (!fileName.startsWith("__MACOSX")) {
          if (entry.type === "File") {
            // If it's a file, upload it to S3
            console.log(`Uploading file: ${filePath}`);
            await this.uploadToS3Stream(filePath, entry);
            entry.autodrain(); // Ensure the stream is drained properly to avoid backpressure issues
          } else {
            entry.autodrain(); // Skip directories
          }
        }
      });

      // Step 3: Await the completion of the unzip stream
      await new Promise((resolve, reject) => {
        unzipStream.on("finish", resolve);
        unzipStream.on("error", reject);
      });
      // If everything is successful
      res.status(200).json({
        message: `Successfully unzipped and uploaded contents of ${archivePath}`,
      });
    } catch (error) {
      console.error("Error unzipping and uploading files:", error);
      return next(
        new AppError(
          "Error unzipping and uploading files: " + error?.message,
          400
        )
      );
    }
  }

  async archive(req, res, next) {
    const { files, destination, name } = req.body;
    const bucketName = req.headers["bucket-name"];

    if (!bucketName) {
      return res
        .status(400)
        .send({ error: "Bucket name is required in headers" });
    }
    this.bucketName = bucketName;
    const zipStream = new stream.PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Pipe the archive data to the output stream
    archive.pipe(zipStream);

    for (const file of files) {
      const params = {
        Bucket: bucketName,
        Key: file,
      };

      try {
        // Get the file from S3 using GetObjectCommand
        const command = new GetObjectCommand(params);
        const data = await this.s3Client.send(command);

        // Convert the S3 Body stream to buffer
        const fileStream = data.Body;

        // Append the file stream to the archive
        archive.append(fileStream, { name: file.split("/").pop() });
      } catch (error) {
        console.warn(
          `Error retrieving file from S3: ${file} - ${error.message}`
        );
      }
    }

    // Finalize the archive
    archive.finalize();

    try {
      // Use PutObjectCommand to upload the ZIP file to S3
      const filePath = `${destination}${name}`;
      const uploadResult = await this.uploadToS3Stream(
        filePath,
        zipStream,
        "application/zip"
      );
      res.status(200).json({
        status: "success",
        message: `Archive successfully created at ${uploadResult?.Location}`,
      });
    } catch (uploadError) {
      console.error(`Error uploading archive to S3: ${uploadError.message}`);
      return next(
        new AppError(
          `Error uploading archive to S3: ${uploadError.message}`,
          400
        )
      );
    }
  }

  async getThumb(req, res, next) {
    const filePath = req.params[0]; // Extract the file path from the URL
    const bucketName = req.headers["bucket-name"];

    if (bucketName) {
      this.bucketName = bucketName;
    }
    try {
      const fileStream = await this.getFileStream(filePath);

      // Set appropriate headers for the file
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${filePath.split("/").pop()}"`
      );
      res.setHeader("Content-Type", "application/octet-stream"); // You can set the content type based on the file type

      // Pipe the file stream to the response
      fileStream.pipe(res);
    } catch (uploadError) {
      console.error(`Error uploading archive to S3: ${uploadError.message}`);
      return next(
        new AppError(
          `Error uploading archive to S3: ${uploadError.message}`,
          400
        )
      );
    }
  }

  async getLink(req, res, next) {
    const { path } = req.body;
    const bucketName = req.headers["bucket-name"];

    if (bucketName) {
      this.bucketName = bucketName;
    }
    try {
      const filePath = await this.getPresignedUrl(path);
      res.status(200).send({ path: filePath });
    } catch (error) {
      return next(
        new AppError(`Error generating link to S3: ${error.message}`, 400)
      );
    }
  }

  async saveImage(req, res, next) {
    let { path, file, isnew } = req.body;
    const bucketName = req.headers["bucket-name"];

    if (bucketName) {
      this.bucketName = bucketName;
    }

    // Strip the base64 encoding header and get the actual image data
    file = file.split(";base64,").pop();

    // Validate the file extension
    if (!checkExtension(nodePath.extname(path))) {
      return next(new AppError(`Wrong File Format ${path}`, 400));
    }

    // Ensure that all necessary variables are set
    if (!checkVariables([path, file])) {
      return next(new AppError("Variables not set!", 400));
    }

    // If 'isnew' is true, modify the file path to include a timestamp
    if (isnew) {
      const nameNew = path.split(".");
      const timestamp = new Date().getTime();
      path = `${nameNew[0]}_${timestamp}.${nameNew[1]}`;
    }
    // Prepare the S3 upload parameters
    const uploadParams = {
      Bucket: this.bucketName, // S3 bucket name
      Key: path, // File path in the S3 bucket
      Body: Buffer.from(file, "base64"), // Convert base64 data to buffer
      ContentEncoding: "base64", // Specify the encoding
      ContentType: "image/jpeg", // Adjust the content type according to your file type
    };

    try {
      // Upload the image to S3
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Respond with success
      res.status(200).json({
        status: "success",
        message: "File successfully uploaded to S3!",
      });
    } catch (err) {
      // Handle any errors that occur during the upload
      return next(new AppError("Error while uploading file to S3", 400));
    }
  }
}

module.exports = S3Controller;
