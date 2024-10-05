/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CommonPrefix,
  _Object as ContentsType,
} from "@aws-sdk/client-s3";
import {
  PathParam,
  RenameFilesParams,
  CreateNewFileParams,
  CreateNewFolderParams,
  PasteFilesParams,
  DeleteItemsParams,
  UnzipParams,
  ArchiveParams,
  SaveFileParams,
  GetFoldersListResponse,
  GetFilesListResponse,
  IServerConnection,
} from "./types";
import { FolderList, ItemType, S3BucketInstance, FileType } from "../types";

const convertCommonPrefixes = (
  commonPrefixes?: CommonPrefix[]
): FolderList[] => {
  if (!Array.isArray(commonPrefixes)) {
    return [];
  }
  return commonPrefixes?.map((dir) => ({
    path: dir.Prefix!,
    name: (dir.Prefix!.match(/([^/]+)\/$/) || [])[1],
    created: "",
    modified: "",
    id: dir.Prefix! + Date.now(),
    type: ItemType.FOLDER,
    children: [],
    size: 0,
    private: false,
  }));
};

const convertContents = (contents?: ContentsType[]): FileType[] => {
  if (!Array.isArray(contents)) {
    return [];
  }
  return contents?.reduce((result: FileType[], file) => {
    const path = file.Key!;
    const match = path.match(/([^/]+)\.([^./]+)$/);

    // If match is null or undefined, skip this file
    if (!match || !match[2]) {
      return result;
    }

    const fileNameWithExt = match[0];
    const extension = `.${match[2]}` as FileType["extension"];

    result.push({
      path,
      name: fileNameWithExt!,
      created: String(file.LastModified || ""),
      modified: String(file.LastModified || ""),
      id: file.ETag || path + Date.now(),
      type: ItemType.FILE,
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
  // eslint-disable-next-line prefer-template
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

// Extend the class to handle S3 operations
class S3Connection extends IServerConnection {
  private s3Client: S3Client;

  private bucketName: string;

  constructor(config: S3BucketInstance) {
    super(); // Call the abstract class constructor
    if (!config.bucket) {
      throw new Error("S3 Bucket name is not defined.");
    }

    this.bucketName = config.bucket;
    this.s3Client = new S3Client(config);
    this.copyFilesToFolder = this.copyFilesToFolder.bind(this);
    this.cutFilesToFolder = this.cutFilesToFolder.bind(this);
  }

  private async deleteObjectsRecursively({
    path,
    continuationToken,
    retries = 0,
    keepRoot = false, // New parameter
  }: {
    path: string;
    continuationToken?: string;
    retries?: number;
    keepRoot?: boolean;
  }): Promise<void> {
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
        Key: object.Key!,
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

        console.log(`Deleted ${deleteObjects.length} objects from '${path}'`);
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

  async getFolderTree(prefix = ""): Promise<GetFoldersListResponse> {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix,
      Delimiter: "/", // Ensure it fetches only folders
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    // Convert common prefixes to folder list
    const folderList = convertCommonPrefixes(response?.CommonPrefixes);

    // Recursively fetch subfolders for each folder in the folderList
    // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
    for (const folder of folderList) {
      // Fetch subfolders for the current folder
      // eslint-disable-next-line no-await-in-loop
      const subFolderTree = await this.getFolderTree(folder.path);

      // Populate the `children` field with the fetched subfolder structure
      folder.children = subFolderTree.children;
    }

    // Return the folder structure
    return {
      path: prefix || "/",
      name: prefix ? (prefix.match(/([^/]+)\/$/) || [])[1] : "root",
      created: "null",
      id: String(Date.now()),
      modified: "null",
      type: ItemType.FOLDER,
      size: 0,
      children: folderList,
    };
  }

  // Method to list files in a folder (S3 "folder" is just a prefix)
  async getFilesList({ path }: PathParam): Promise<GetFilesListResponse> {
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
    return result;
  }

  // Method to create a new file in S3
  async createNewFile(params: any): Promise<any> {
    const command = new PutObjectCommand({
      ...params,
      Bucket: this.bucketName,
    });
    return this.s3Client.send(command);
  }

  // Method to upload files to S3
  async uploadFile(formData: any): Promise<any> {
    const path = formData.get("path");

    // Extract files from the form data
    const files = formData.getAll("files");
    // Array to store promises for each upload
    const uploadPromises: any[] = [];

    // const { file, path } = body; // Extract file and path from body
    files.forEach((file: any) => {
      const params = {
        Key: `${path}${file.name}`, // Combine path and filename
        Body: file,
        ContentType: file.type,
      };

      // Upload each file and store the promise
      uploadPromises.push(this.createNewFile(params));
    });

    try {
      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      console.log("All files uploaded successfully:", uploadResults);
      return uploadResults;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  }

  // Method to save a file in S3
  async saveFile({ file, path, isnew }: SaveFileParams): Promise<any> {
    const params = {
      Key: `${path}${isnew ? String(Date.now()) : ""}`, // Combine path and filename
      Body: file,
      ContentType: file.type,
    };

    return this.createNewFile(params);
  }

  // Method to create a new folder (S3 doesn't have real folders, so create an empty object with a trailing slash)
  async createNewFolder({ path, folder }: CreateNewFolderParams): Promise<any> {
    const Key = `${path}${folder}/`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key, // Create "folder" with a trailing slash
      Body: "",
    });
    return this.s3Client.send(command);
  }

  // Method to delete objects from S3
  async deleteItems({ items }: DeleteItemsParams): Promise<any> {
    const deletePromises = items.map((item) =>
      this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.bucketName, Key: item })
      )
    );
    return Promise.all(deletePromises);
  }

  // Method to copy files within S3
  async copyFilesToFolder({
    items,
    destination,
  }: PasteFilesParams): Promise<any> {
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

  // Method to move (cut) files within S3 (copy + delete)
  async cutFilesToFolder({
    items,
    destination,
  }: PasteFilesParams): Promise<any> {
    await this.copyFilesToFolder({ items, destination });
    return this.deleteItems({ items });
  }

  async renameFiles({
    path,
    newname,
  }: {
    path: string;
    newname: string;
  }): Promise<void> {
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
      const oldKey = object.Key!;
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
        Objects: listResponse.Contents.map((object) => ({ Key: object.Key! })),
      },
    });

    await this.s3Client.send(deleteCommand);
  }

  async emptyDir({ path }: { path: string }): Promise<void> {
    // Step 1: Ensure the path is a folder (folders end with a '/')
    if (!path.endsWith("/")) {
      console.error(
        "The provided path is not a folder. Path must end with a trailing slash."
      );
      return;
    }

    // Step 2: Start the recursive deletion process
    await this.deleteObjectsRecursively({ path, keepRoot: true });
  }

  async duplicateItem({ path }: { path: string }): Promise<void> {
    // Step 1: Check if the path is a file or folder by listing its contents
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
    const lastSegment = trimmedPath.split("/").pop()!; // Get the last segment (file/folder name)
    const newName = generateCopyName(lastSegment); // Generate new name with _copy and timestamp

    const rootPath = path.replace(lastSegment, ""); // Get the root path (parent directory)
    const newRootPath = isFolder
      ? `${rootPath}${newName}/`
      : `${rootPath}${newName}`; // New folder or file path

    // Step 3: Copy all items under the original path to the new location
    const copyPromises = listResponse.Contents.map(async (object) => {
      const oldKey = object.Key!;
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
  }

  // Method to unzip a file (you'd likely need a third-party library to handle actual unzipping)
  async unzip({ file, destination }: UnzipParams): Promise<any> {
    // Logic to unzip the file using a library and re-upload extracted files to S3
    throw new Error(
      `Archiving files is not supported directly by S3. ${this.bucketName}`
    );
  }

  // Method to archive files (you'd likely need to handle zipping and uploading)
  async archive({ files, destination, name }: ArchiveParams): Promise<any> {
    // Logic to zip files and upload the archive
    throw new Error(
      `Archiving files is not supported directly by S3. ${this.bucketName}`
    );
  }
}

export default S3Connection;
