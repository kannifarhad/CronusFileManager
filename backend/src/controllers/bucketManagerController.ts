/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2024, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/

import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  CommonPrefix,
  _Object,
  CopyObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import unzipper from "unzipper";
import archiver from "archiver";
import { Readable, PassThrough } from "stream";
import * as nodePath from "path";
import { Request, Response, NextFunction } from "express";
import { escapePath, checkExtension, checkVariables } from "../utilits/filemanager";
import AppError from "../utilits/appError";
import FileManagerSDKBase from "../sdk/FileManagerSDKBase";

interface FileItem {
  path: string;
  name: string;
  created: string;
  modified: string;
  id: string;
  type: "file" | "folder";
  size: number;
  private: boolean;
  extension?: string;
  children?: FileItem[];
}

interface DeleteObjectsParams {
  path: string;
  continuationToken?: string;
  retries?: number;
  keepRoot?: boolean;
}

interface CopyFilesParams {
  items: string[];
  destination: string;
}

interface DeleteListParams {
  pathList: string[];
  continuationToken?: string;
  retries?: number;
  keepRoot?: boolean;
}

interface FileMap {
  name: string;
  path: string;
}

interface RequestWithFiles extends Request {
  files?: Express.Multer.File[];
}

// Convert common prefixes to folder structure
const convertCommonPrefixes = (commonPrefixes: CommonPrefix[] = []): FileItem[] => {
  return commonPrefixes.map((dir) => ({
    path: dir.Prefix || "",
    name: (dir.Prefix?.match(/([^/]+)\/$/) || [])[1] || "",
    created: "",
    modified: "",
    id: (dir.Prefix || "") + Date.now(),
    type: "folder" as const,
    children: [],
    size: 0,
    private: false,
  }));
};

const convertContents = (contents?: _Object[]): FileItem[] => {
  if (!Array.isArray(contents)) {
    return [];
  }
  return contents.reduce<FileItem[]>((result, file) => {
    const path = file.Key || "";
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
function removeLastSegment(path: string): string {
  const trimmedPath = path.replace(/\/+$/, ""); // Remove trailing slashes
  const segments = trimmedPath.split("/");
  segments.pop(); // Remove the last segment (file or folder name)

  // Return the base path; add a trailing slash if not empty
  return segments.length > 0 ? segments.join("/") + "/" : "";
}

function generateCopyName(originalName: string): string {
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
function getContentTypeByFile(fileName: string): string {
  const extension = fileName.split(".").pop();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    txt: "text/plain",
    pdf: "application/pdf",
    html: "text/html",
    json: "application/json",
    zip: "application/zip",
  };
  return mimeTypes[extension || ""] || "application/octet-stream";
}

class S3Controller {
  protected filemanagerService: FileManagerSDKBase;
  constructor(filemanagerService: FileManagerSDKBase) {
    this.filemanagerService = filemanagerService;
  }

  // PRIVATE METHODS//
  private async deleteObjectsRecursively({
    path,
    continuationToken,
    retries = 0,
    keepRoot = false,
  }: DeleteObjectsParams): Promise<void> {
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
        ContinuationToken: continuationToken,
      });

      const listResponse = await this.s3Client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        console.log(`Directory '${path}' is already empty or there are no more items to delete.`);
        return;
      }

      // Step 2: Prepare the list of objects to delete
      let deleteObjects = listResponse.Contents.map((object) => ({
        Key: object.Key || "",
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
        await this.deleteObjectsRecursively({
          path,
          continuationToken: listResponse.NextContinuationToken,
          retries: 0,
          keepRoot,
        });
      }
    } catch (error) {
      console.error(`Error deleting objects from path '${path}', retrying...`, error);
      await this.deleteObjectsRecursively({
        path,
        continuationToken,
        retries: retries + 1,
        keepRoot,
      });
    }
  }

  private async copyFilesToFolder({ items, destination }: CopyFilesParams): Promise<CopyObjectCommandOutput[]> {
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

  private async deleteListOfObjectsRecursively({
    pathList,
    continuationToken,
    retries = 0,
    keepRoot = false,
  }: DeleteListParams): Promise<void[]> {
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

  private async uploadToS3Stream(key: string, fileStream: Readable | PassThrough, ContentType: string): Promise<void> {
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

  private async getPresignedUrl(filePath: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: filePath,
    };

    try {
      const command = new GetObjectCommand(params);
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      throw error;
    }
  }

  private async getFileStream(filePath: string): Promise<Readable> {
    const params = {
      Bucket: this.bucketName,
      Key: filePath,
    };

    try {
      const command = new GetObjectCommand(params);
      const data = await this.s3Client.send(command);
      return data.Body as Readable;
    } catch (error) {
      console.error("Error getting file from S3:", error);
      throw error;
    }
  }
  // END PRIVATE METHODS //

  // Recursive function to get the folder tree
  private async getFolderTree(bucketName: string, prefix = ""): Promise<FileItem> {
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: "/",
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    const folderList = convertCommonPrefixes(response.CommonPrefixes);

    for (const folder of folderList) {
      const subFolderTree = await this.getFolderTree(bucketName, folder.path);
      folder.children = subFolderTree.children;
    }

    return {
      path: prefix || "/",
      name: prefix ? (prefix.match(/([^/]+)\/$/) || [])[1] || "root" : "root",
      created: "null",
      id: String(Date.now()),
      modified: "null",
      type: "folder",
      size: 0,
      children: folderList,
      private: false,
    };
  }

  async folderTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bucketName = req.headers["bucket-name"] as string;

      if (!bucketName) {
        res.status(400).send({ error: "Bucket name is required in headers" });
        return;
      }

      const prefix = (req.query.prefix as string) || "";
      const folderTree = await this.getFolderTree(bucketName, prefix);

      res.status(200).send(folderTree);
    } catch (error) {
      console.error("Error fetching folder tree:", error);
      res.status(500).send({ error: "Error fetching folder tree" });
    }
  }

  async folderInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bucketName = req.headers["bucket-name"] as string;
      const { path } = req.body;

      if (!bucketName) {
        res.status(400).send({ error: "Bucket name is required in headers" });
        return;
      }
      this.bucketName = bucketName;

      const command = new ListObjectsCommand({
        Bucket: this.bucketName,
        Prefix: path === "/" ? "" : path,
        Delimiter: "/",
      });

      const response = await this.s3Client.send(command);
      const result = [...convertCommonPrefixes(response?.CommonPrefixes), ...convertContents(response?.Contents)];
      res.status(200).json({ children: result });
    } catch (error: any) {
      console.error("Error listing files:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async rename(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bucketName = req.headers["bucket-name"] as string;
    const { path, newname } = req.body;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    this.bucketName = bucketName;

    const rootPath = removeLastSegment(path);
    const trimmedPath = path.replace(/\/+$/, "");
    const oldName = trimmedPath.split("/").pop() || "";

    if (!oldName) {
      console.warn("No valid name found in the path to rename. Aborting.");
      return;
    }

    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: path,
    });

    const listResponse = await this.s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.warn("No files found at the given path. Aborting rename.");
      return;
    }

    const isFolder = path.endsWith("/");

    const copyPromises = listResponse.Contents.map(async (object) => {
      const oldKey = object.Key || "";
      const remainingPath = oldKey.slice(path.length);

      const newKey = isFolder ? `${rootPath}${newname}/${remainingPath}` : `${rootPath}${newname}${remainingPath}`;

      await this.s3Client.send(
        new CopyObjectCommand({
          Bucket: this.bucketName,
          Key: newKey,
          CopySource: `${this.bucketName}/${oldKey}`,
        })
      );
    });

    await Promise.all(copyPromises);

    if (isFolder && listResponse.Contents.length === 1 && listResponse.Contents[0].Key === path) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: `${rootPath}${newname}/`,
          Body: "",
        })
      );
    }

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: listResponse.Contents.map((object) => ({ Key: object.Key || "" })),
      },
    });

    await this.s3Client.send(deleteCommand);
    res.status(200).json({
      status: "success",
      message: "File or Folder successfully renamed!",
    });
  }

  async createFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bucketName = req.headers["bucket-name"] as string;
    let { path, file, contentType, fileContent } = req.body;
    path = escapePath(path);
    file = escapePath(file);

    if (!checkVariables([path, file])) {
      next(new AppError("Variables not set!", 400));
      return;
    }

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    this.bucketName = bucketName;

    try {
      let normalizedPath = path.replace(/^\/+|\/+$/g, "");
      const fullFilePath = `${normalizedPath}/${file}`;

      let fileBuffer: Buffer | string;
      if (fileContent) {
        if (typeof fileContent === "string" && fileContent.startsWith("data:")) {
          const base64Data = fileContent.split(",")[1];
          fileBuffer = Buffer.from(base64Data, "base64");
        } else {
          fileBuffer = Buffer.isBuffer(fileContent) ? fileContent : Buffer.from(fileContent, "binary");
        }
      } else {
        fileBuffer = "";
      }

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fullFilePath,
        Body: fileBuffer,
        ContentType: contentType || "application/octet-stream",
      });

      await this.s3Client.send(command);
      res.status(200).json({
        status: "success",
        message: "File successfully created!",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send({ error: "Error uploading file" });
    }
  }

  async createFolder(req: Request, res: Response, next: NextFunction): Promise<void> {
    let { path, folder } = req.body;
    let normalizedPath = path.replace(/^\/+|\/+$/g, "");
    const Key = `${normalizedPath}/${folder}/`;

    const bucketName = req.headers["bucket-name"] as string;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }

    this.bucketName = bucketName;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key,
      Body: "",
    });
    await this.s3Client.send(command);
    res.status(200).json({
      status: "success",
      message: "Folder successfully created!",
    });
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { items } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    try {
      const deletePromises = items.map((path: string) => this.deleteObjectsRecursively({ path, keepRoot: false }));
      await Promise.all(deletePromises);
      res.status(200).json({
        status: "success",
        message: "File or folder successfully deleted!",
      });
    } catch (error: any) {
      next(new AppError(error?.message, 400));
    }
  }

  async copy(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { items, destination } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    try {
      await this.copyFilesToFolder({ items, destination });
      res.status(200).json({
        status: "success",
        message: "Files or folders successfully copied!",
      });
    } catch (error: any) {
      next(new AppError(error?.message, 400));
    }
  }

  async move(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { items, destination } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    try {
      await this.copyFilesToFolder({ items, destination });
      await this.deleteListOfObjectsRecursively({ pathList: items });

      res.status(200).json({
        status: "success",
        message: "Files or folders successfully moved!",
      });
    } catch (error: any) {
      next(new AppError(error?.message, 400));
    }
  }

  async duplicateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { path } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    this.bucketName = bucketName;

    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: path,
      });

      const listResponse = await this.s3Client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        console.log("No items found at the given path. Aborting duplication.");
        return;
      }

      const isFolder = path.endsWith("/");

      const trimmedPath = path.replace(/\/+$/, "");
      const lastSegment = trimmedPath.split("/").pop() || "";
      const newName = generateCopyName(lastSegment);

      const rootPath = path.replace(lastSegment, "");
      const newRootPath = isFolder ? `${rootPath}${newName}/` : `${rootPath}${newName}`;

      const copyPromises = listResponse.Contents.map(async (object) => {
        const oldKey = object.Key || "";
        const relativePath = oldKey.slice(path.length);

        const newKey = isFolder ? `${newRootPath}${relativePath}` : newRootPath;

        await this.s3Client.send(
          new CopyObjectCommand({
            Bucket: this.bucketName,
            Key: newKey,
            CopySource: `${this.bucketName}/${oldKey}`,
          })
        );
      });

      await Promise.all(copyPromises);

      res.status(200).json({
        status: "success",
        message: "Files or folders successfully duplicated!",
      });
    } catch (error: any) {
      next(new AppError(error?.message, 400));
    }
  }

  async emptydir(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { path } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    this.bucketName = bucketName;
    if (!path.endsWith("/")) {
      next(new AppError("The provided path is not a folder. Path must end with a trailing slash.", 400));
      return;
    }
    try {
      await this.deleteObjectsRecursively({ path, keepRoot: true });

      res.status(200).json({
        status: "success",
        message: "Directory successfully emptied!",
      });
    } catch (error: any) {
      next(new AppError(error?.message, 400));
    }
  }

  async uploadFiles(req: RequestWithFiles, res: Response, next: NextFunction): Promise<void> {
    try {
      const bucketName = req.headers["bucket-name"] as string;
      const path = req.body.path || "";
      const fileMaps = req.body.fileMaps;
      const files = req.files;
      let pathMappings: FileMap[] | null = null;

      if (fileMaps) {
        pathMappings = JSON.parse(fileMaps) ?? [];
      }
      if (!bucketName || !files || files.length === 0) {
        res.status(400).send({ error: "Bucket name and files are required" });
        return;
      }
      this.bucketName = bucketName;

      const normalizedPath = path.replace(/^\/+|\/+$/g, "");

      const uploadPromises = files.map((file) => {
        const relativePath =
          pathMappings?.find((currFile) => currFile?.name === file.originalname)?.path ?? `/${file.originalname}`;
        const fullFilePath = `${normalizedPath ? normalizedPath : ""}${relativePath}`;

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fullFilePath,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        return this.s3Client.send(command).then((uploadResponse) => ({
          fileName: file.originalname,
          uploadResponse,
        }));
      });

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

  async unzipFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bucketName = req.headers["bucket-name"] as string;
      const archivePath = req.body.file;
      const uploadDirectory = req.body.destination;

      if (!bucketName || !archivePath) {
        res.status(400).send({ error: "Bucket name and ZIP file path are required" });
        return;
      }

      this.bucketName = bucketName;

      const zipFileStream = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: archivePath,
        })
      );
      console.log("this.bucketName", this.bucketName);

      const unzipStream = (zipFileStream.Body as Readable).pipe(unzipper.Parse());
      unzipStream.on("error", (err) => {
        console.error("Error during unzip stream:", err);
        throw err;
      });
      unzipStream.on("close", () => {
        console.log("Unzip stream has closed successfully.");
      });

      unzipStream.on("entry", async (entry: any) => {
        const fileName = entry.path;
        const filePath = `${uploadDirectory}${fileName}`;
        if (!fileName.startsWith("__MACOSX")) {
          if (entry.type === "File") {
            console.log(`Uploading file: ${filePath}`);
            await this.uploadToS3Stream(filePath, entry, getContentTypeByFile(fileName));
            entry.autodrain();
          } else {
            entry.autodrain();
          }
        }
      });

      await new Promise<void>((resolve, reject) => {
        unzipStream.on("finish", resolve);
        unzipStream.on("error", reject);
      });

      res.status(200).json({
        message: `Successfully unzipped and uploaded contents of ${archivePath}`,
      });
    } catch (error: any) {
      console.error("Error unzipping and uploading files:", error);
      next(new AppError("Error unzipping and uploading files: " + error?.message, 400));
    }
  }

  async archive(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { files, destination, name } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (!bucketName) {
      res.status(400).send({ error: "Bucket name is required in headers" });
      return;
    }
    this.bucketName = bucketName;
    const zipStream = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(zipStream);

    for (const file of files) {
      const params = {
        Bucket: bucketName,
        Key: file,
      };

      try {
        const command = new GetObjectCommand(params);
        const data = await this.s3Client.send(command);

        const fileStream = data.Body as Readable;

        archive.append(fileStream, { name: file.split("/").pop() || file });
      } catch (error: any) {
        console.warn(`Error retrieving file from S3: ${file} - ${error.message}`);
      }
    }

    archive.finalize();

    try {
      const filePath = `${destination}${name}`;
      await this.uploadToS3Stream(filePath, zipStream, "application/zip");
      res.status(200).json({
        status: "success",
        message: `Archive successfully created at ${filePath}`,
      });
    } catch (uploadError: any) {
      console.error(`Error uploading archive to S3: ${uploadError.message}`);
      next(new AppError(`Error uploading archive to S3: ${uploadError.message}`, 400));
    }
  }

  async getThumb(req: Request, res: Response, next: NextFunction): Promise<void> {
    const filePath = req.params[0];
    const bucketName = req.headers["bucket-name"] as string;

    if (bucketName) {
      this.bucketName = bucketName;
    }
    try {
      const fileStream = await this.getFileStream(filePath);

      res.setHeader("Content-Disposition", `inline; filename="${filePath.split("/").pop()}"`);
      res.setHeader("Content-Type", "application/octet-stream");

      fileStream.pipe(res);
    } catch (uploadError: any) {
      console.error(`Error getting file from S3: ${uploadError.message}`);
      next(new AppError(`Error getting file from S3: ${uploadError.message}`, 400));
    }
  }

  async getLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { path } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (bucketName) {
      this.bucketName = bucketName;
    }
    try {
      const filePath = await this.getPresignedUrl(path);
      res.status(200).send({ path: filePath });
    } catch (error: any) {
      next(new AppError(`Error generating link to S3: ${error.message}`, 400));
    }
  }

  async saveImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    let { path, file, isnew } = req.body;
    const bucketName = req.headers["bucket-name"] as string;

    if (bucketName) {
      this.bucketName = bucketName;
    }

    file = file.split(";base64,").pop();

    if (!checkExtension(nodePath.extname(path))) {
      next(new AppError(`Wrong File Format ${path}`, 400));
      return;
    }

    if (!checkVariables([path, file])) {
      next(new AppError("Variables not set!", 400));
      return;
    }

    if (isnew) {
      const nameNew = path.split(".");
      const timestamp = new Date().getTime();
      path = `${nameNew[0]}_${timestamp}.${nameNew[1]}`;
    }

    const uploadParams = {
      Bucket: this.bucketName,
      Key: path,
      Body: Buffer.from(file, "base64"),
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      res.status(200).json({
        status: "success",
        message: "File successfully uploaded to S3!",
      });
    } catch (err) {
      next(new AppError("Error while uploading file to S3", 400));
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bucketName = req.headers["bucket-name"] as string;
    const { text, path = "" } = req.body;
    const searchResults: _Object[] = [];
    let continuationToken: string | undefined = undefined;

    try {
      do {
        const command: ListObjectsV2Command = new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: path,
          ContinuationToken: continuationToken,
        });
        const response = await this.s3Client.send(command);

        const matchingItems = (response.Contents || []).filter((item) => {
          const fileName = (item.Key || "").split("/").pop() || "";
          return fileName.toLowerCase().includes(text.toLowerCase());
        });

        searchResults.push(...matchingItems);
        continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
      } while (continuationToken);

      res.status(200).json(searchResults);
    } catch (error) {
      console.error("Error searching S3 bucket:", error);
      throw new Error("Error searching the S3 bucket");
    }
  }
}

export default S3Controller;
