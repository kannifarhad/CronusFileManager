/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import unzipper from "unzipper";
import archiver from "archiver";
import nodePath from "path";
import { Readable, PassThrough } from "stream";
import {
  S3ClientConfig,
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CommonPrefix,
  _Object,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import FileManagerProviderBase, { FileManagerError } from "./FileManagerProviderBase";
import {
  FSItem,
  SearchParams,
  RenameParams,
  CreateFileParams,
  CreateFolderParams,
  DeleteParams,
  CopyParams,
  MoveParams,
  DuplicateParams,
  EmptyDirParams,
  UploadFilesParams,
  UnzipParams,
  ArchiveParams,
  GetThumbParams,
  GetLinkParams,
  SaveImageParams,
  FileManagerProviderBaseConfig,
  FolderTreeOptions,
  ENTITY_CONST,
} from "../types";
import { sanitizePath } from "../utils/sanitazePath";

export interface S3FileManagerConfig extends FileManagerProviderBaseConfig {
  s3config: S3ClientConfig;
  bucketName: string;
}

export class S3BucketFileManagerProvider extends FileManagerProviderBase {
  protected bucketName: string;
  protected s3Client: S3Client;

  constructor({ s3config, bucketName, ...config }: S3FileManagerConfig) {
    super(config);
    this.bucketName = bucketName;
    this.s3Client = new S3Client(s3config);
  }

  async getFolderTree({ prefix = "", withChildren = true, includeFiles = false }: FolderTreeOptions = {}) {
    try {
      const normalizedPrefix = this.normalizePath(prefix);
      return await this.directoryTree(normalizedPrefix, { withChildren, includeFiles });
    } catch (error: any) {
      throw new FileManagerError(`Failed to retrieve folder tree: ${error.message}`, "FOLDER_TREE_ERROR", prefix);
    }
  }

  async getFolderInfo(path: string) {
    try {
      const normalizedPath = this.normalizePath(path);
      return await this.listFolderContents(normalizedPath);
    } catch (error: any) {
      throw new FileManagerError(
        `Failed to retrieve folder info for '${path}': ${error.message}`,
        "FOLDER_INFO_ERROR",
        path
      );
    }
  }

  async search({ text, path = "" }: SearchParams): Promise<FSItem[]> {
    if (!text || text.trim().length === 0) {
      throw new FileManagerError("Search text cannot be empty", "INVALID_SEARCH_TEXT");
    }

    try {
      const normalizedPath = this.normalizePath(path);
      return await this.searchInS3(normalizedPath, text.toLowerCase());
    } catch (error: any) {
      throw new FileManagerError(`Search failed: ${error.message}`, "SEARCH_ERROR", path);
    }
  }

  async rename({ path, newname }: RenameParams) {
    if (!this.checkVariables([path, newname])) {
      throw new FileManagerError("Path and new name are required", "MISSING_PARAMETERS");
    }

    if (!this.checkExtension(nodePath.extname(newname))) {
      throw new FileManagerError(`Invalid file extension in '${newname}'`, "INVALID_EXTENSION", path);
    }

    const normalizedPath = this.normalizePath(path);

    if (!(await this.exists(normalizedPath))) {
      throw new FileManagerError(`Item '${path}' does not exist`, "ITEM_NOT_FOUND", path);
    }

    const isFolder = normalizedPath.endsWith("/");
    const parentPath = this.getParentPath(normalizedPath);
    const newPath = `${parentPath}${newname}${isFolder ? "/" : ""}`;

    if (await this.exists(newPath)) {
      throw new FileManagerError(`Item with name '${newname}' already exists`, "ITEM_EXISTS", path);
    }

    try {
      await this.copyObject(normalizedPath, newPath, isFolder);
      await this.deleteObject(normalizedPath, isFolder);
    } catch (error: any) {
      throw new FileManagerError(`Failed to rename '${path}' to '${newname}': ${error.message}`, "RENAME_FAILED", path);
    }
  }

  async createFile({ path, file, contentType, fileContent }: CreateFileParams) {
    if (!this.checkVariables([path, file])) {
      throw new FileManagerError("Path and filename are required", "MISSING_PARAMETERS");
    }

    if (!this.checkExtension(nodePath.extname(file))) {
      throw new FileManagerError(`Invalid or unaccepted file format '${file}'`, "INVALID_EXTENSION");
    }

    const normalizedPath = this.normalizePath(path);
    const fullPath = this.joinS3Path(normalizedPath, file);

    if (await this.exists(fullPath)) {
      throw new FileManagerError(`File '${file}' already exists in '${path}'`, "FILE_EXISTS", fullPath);
    }

    try {
      let body: Buffer | string = "";

      if (fileContent) {
        if (typeof fileContent === "string" && fileContent.startsWith("data:")) {
          const base64Data = fileContent.split(",")[1];
          body = Buffer.from(base64Data, "base64");
        } else {
          body = Buffer.isBuffer(fileContent) ? fileContent : Buffer.from(fileContent, "binary");
        }
      }

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fullPath,
          Body: body,
          ContentType: contentType || "application/octet-stream",
        })
      );
    } catch (error: any) {
      throw new FileManagerError(`Failed to create file '${file}': ${error.message}`, "CREATE_FILE_FAILED", fullPath);
    }
  }

  async createFolder({ path, folder }: CreateFolderParams) {
    if (!this.checkVariables([path, folder])) {
      throw new FileManagerError("Path and folder name are required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);
    const folderPath = this.joinS3Path(normalizedPath, folder) + "/";

    if (await this.exists(folderPath)) {
      throw new FileManagerError(`Folder '${folder}' already exists in '${path}'`, "FOLDER_EXISTS", folderPath);
    }

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: folderPath,
          Body: "",
        })
      );
    } catch (error: any) {
      throw new FileManagerError(
        `Failed to create folder '${folder}': ${error.message}`,
        "CREATE_FOLDER_FAILED",
        folderPath
      );
    }
  }

  async delete({ items }: DeleteParams) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new FileManagerError("No items provided for deletion", "NO_ITEMS");
    }

    const errors: Array<{ path: string; error: string }> = [];

    await Promise.allSettled(
      items.map(async (itemPath: string) => {
        try {
          const normalizedPath = this.normalizePath(itemPath);
          const isFolder = normalizedPath.endsWith("/");
          await this.deleteObject(normalizedPath, isFolder);
        } catch (err: any) {
          errors.push({ path: itemPath, error: err.message });
        }
      })
    );

    if (errors.length > 0) {
      const errorDetails = errors.map((e) => `${e.path}: ${e.error}`).join("; ");
      throw new FileManagerError(
        `Failed to delete ${errors.length} of ${items.length} items: ${errorDetails}`,
        "DELETE_FAILED"
      );
    }
  }

  async copy({ items, destination }: CopyParams) {
    if (!this.checkVariables([destination])) {
      throw new FileManagerError("Destination is required", "MISSING_PARAMETERS");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new FileManagerError("No items provided for copying", "NO_ITEMS");
    }

    const normalizedDestination = this.normalizePath(destination);
    // Ensure destination is treated as a folder
    const destFolder = normalizedDestination.endsWith("/") ? normalizedDestination : normalizedDestination + "/";

    const errors: Array<{ path: string; error: string }> = [];

    await Promise.allSettled(
      items.map(async (itemPath: string) => {
        try {
          const normalizedPath = this.normalizePath(itemPath);

          if (!(await this.exists(normalizedPath))) {
            errors.push({ path: itemPath, error: "Item does not exist" });
            return;
          }

          const isFolder = normalizedPath.endsWith("/");
          const fileName = this.getFileName(normalizedPath);

          // Build destination path
          let destPath: string;
          if (isFolder) {
            destPath = this.joinS3Path(destFolder, fileName) + "/";
          } else {
            destPath = this.joinS3Path(destFolder, fileName);
          }

          const needsUniqueName = await this.exists(destPath);
          let finalDest = destPath;

          if (needsUniqueName) {
            const uniqueName = await this.generateUniqueNameInDirectory(destFolder, fileName, isFolder);
            if (isFolder) {
              finalDest = this.joinS3Path(destFolder, uniqueName.replace(/\/$/, "")) + "/";
            } else {
              finalDest = this.joinS3Path(destFolder, uniqueName);
            }
          }

          await this.copyObject(normalizedPath, finalDest, isFolder);
        } catch (err: any) {
          errors.push({ path: itemPath, error: err.message });
        }
      })
    );

    if (errors.length > 0) {
      const errorDetails = errors.map((e) => `${e.path}: ${e.error}`).join("; ");
      throw new FileManagerError(
        `Failed to copy ${errors.length} of ${items.length} items: ${errorDetails}`,
        "COPY_FAILED"
      );
    }
  }

  async move({ items, destination }: MoveParams) {
    // No destination check needed - S3 creates paths implicitly
    await this.copy({ items, destination });
    await this.delete({ items });
  }

  async duplicate({ path }: DuplicateParams) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    if (!(await this.exists(normalizedPath))) {
      throw new FileManagerError(`Item '${path}' does not exist`, "ITEM_NOT_FOUND", path);
    }

    try {
      const isFolder = normalizedPath.endsWith("/");
      const parentPath = this.getParentPath(normalizedPath);
      const copyName = await this.generateUniqueCopyName(normalizedPath, isFolder, parentPath);
      const copyPath = this.joinS3Path(parentPath, copyName);

      await this.copyObject(normalizedPath, copyPath, isFolder);
      return copyName;
    } catch (error: any) {
      throw new FileManagerError(`Failed to duplicate '${path}': ${error.message}`, "DUPLICATE_FAILED", path);
    }
  }

  async emptyDir({ path }: EmptyDirParams) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    if (!normalizedPath.endsWith("/")) {
      throw new FileManagerError(
        "The provided path is not a folder. Path must end with a trailing slash.",
        "NOT_A_FOLDER",
        path
      );
    }

    if (!(await this.exists(normalizedPath))) {
      throw new FileManagerError(`Directory '${path}' does not exist`, "DIRECTORY_NOT_FOUND", path);
    }

    try {
      await this.deleteObjectsRecursively(normalizedPath, true);
    } catch (error: any) {
      throw new FileManagerError(`Failed to empty directory '${path}': ${error.message}`, "EMPTY_DIR_FAILED", path);
    }
  }

  async uploadFiles({ files, fileMaps = [], path }: UploadFilesParams) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    if (!files || files.length === 0) {
      throw new FileManagerError("No files provided for upload", "NO_FILES");
    }

    const normalizedPath = this.normalizePath(path);
    const errors: Array<{ file: string; error: string }> = [];

    await Promise.allSettled(
      files.map(async (file) => {
        try {
          const fileOriginalName = Buffer.from(file.originalname, "latin1").toString("utf8");

          if (!this.checkExtension(nodePath.extname(fileOriginalName))) {
            errors.push({ file: fileOriginalName, error: "Invalid file extension" });
            return;
          }

          const relativePath = sanitizePath(
            fileMaps.find((map) => map.name === fileOriginalName)?.path ?? `/${fileOriginalName}`,
            { strict: false }
          );
          const fullPath = this.joinS3Path(normalizedPath, relativePath.replace(/^\//, ""));

          // Read file data - handle both buffer and path from multer
          let fileData: Buffer;
          if (file.buffer) {
            fileData = file.buffer;
          } else if (file.path) {
            // Read from disk if multer saved to disk
            const fs = await import("fs/promises");
            fileData = await fs.readFile(file.path);
          } else {
            throw new Error("File has neither buffer nor path");
          }

          if (await this.exists(fullPath)) {
            const dir = this.getParentPath(fullPath);
            const uniqueName = await this.generateUniqueNameInDirectory(dir, fileOriginalName, false);
            const uniquePath = this.joinS3Path(dir, uniqueName);

            await this.uploadToS3(uniquePath, fileData, file.mimetype);
          } else {
            await this.uploadToS3(fullPath, fileData, file.mimetype);
          }
        } catch (err: any) {
          errors.push({ file: file.originalname, error: err.message });
        }
      })
    );

    if (errors.length > 0) {
      const errorDetails = errors.map((e) => `${e.file}: ${e.error}`).join("; ");
      throw new FileManagerError(
        `Failed to upload ${errors.length} of ${files.length} files: ${errorDetails}`,
        "UPLOAD_FAILED"
      );
    }
  }

  async unzip({ file, destination }: UnzipParams) {
    if (!this.checkVariables([file])) {
      throw new FileManagerError("File path is required", "MISSING_PARAMETERS");
    }

    const normalizedFile = this.normalizePath(file);

    if (!(await this.exists(normalizedFile))) {
      throw new FileManagerError(`Archive '${file}' does not exist`, "FILE_NOT_FOUND", file);
    }

    const normalizedDestination = destination ? this.normalizePath(destination) : this.getParentPath(normalizedFile);

    try {
      const stream = await this.getFileStream(normalizedFile);
      const unzipStream = stream.pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of unzipStream) {
        const entryPath = entry.path as string;

        if (!entryPath.startsWith("__MACOSX") && this.checkExtension(nodePath.extname(entryPath))) {
          const fullPath = this.joinS3Path(normalizedDestination, entryPath);

          if (await this.exists(fullPath)) {
            const dir = this.getParentPath(fullPath);
            const ext = nodePath.extname(entryPath);
            const baseName = nodePath.basename(entryPath, ext);
            const uniqueName = await this.generateUniqueNameInDirectory(dir, baseName + ext, false);
            const uniquePath = this.joinS3Path(dir, uniqueName);

            await this.uploadStreamToS3(uniquePath, entry);
          } else {
            await this.uploadStreamToS3(fullPath, entry);
          }
        } else {
          entry.autodrain();
        }
      }
    } catch (error: any) {
      throw new FileManagerError(`Failed to unzip '${file}': ${error.message}`, "UNZIP_FAILED", file);
    }
  }

  async archive({ files, destination, name }: ArchiveParams): Promise<string> {
    if (!this.checkVariables([destination, name]) || !Array.isArray(files) || files.length === 0) {
      throw new FileManagerError("Destination, name, and files are required", "MISSING_PARAMETERS");
    }

    const normalizedDestination = this.normalizePath(destination);

    if (!(await this.exists(normalizedDestination))) {
      throw new FileManagerError(`Destination '${destination}' does not exist`, "DESTINATION_NOT_FOUND", destination);
    }

    const archivePath = this.joinS3Path(normalizedDestination, `${name}.zip`);

    try {
      const zipStream = new PassThrough();
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.pipe(zipStream);

      const uploadPromise = this.uploadStreamToS3(archivePath, zipStream, "application/zip");

      for (const itemPath of files) {
        const normalizedPath = this.normalizePath(itemPath);

        if (!(await this.exists(normalizedPath))) {
          console.warn(`Skipping non-existent file: ${itemPath}`);
          continue;
        }

        const fileName = this.getFileName(normalizedPath);
        const isFolder = normalizedPath.endsWith("/");

        if (isFolder) {
          await this.addFolderToArchive(archive, normalizedPath, fileName);
        } else {
          const stream = await this.getFileStream(normalizedPath);
          archive.append(stream, { name: fileName });
        }
      }

      await archive.finalize();
      await uploadPromise;

      return archivePath;
    } catch (error: any) {
      throw new FileManagerError(`Failed to create archive: ${error.message}`, "ARCHIVE_FAILED", archivePath);
    }
  }

  async saveImage({ file, isnew, path }: SaveImageParams) {
    if (!this.checkVariables([path]) || !file) {
      throw new FileManagerError("Path and file data are required", "MISSING_PARAMETERS");
    }

    let imagePath = path;
    const fileData = typeof file === "string" ? file.split(";base64,").pop()! : file;

    if (!this.checkExtension(nodePath.extname(imagePath))) {
      throw new FileManagerError(`Invalid image format for '${path}'`, "INVALID_EXTENSION", path);
    }

    if (isnew) {
      const nameParts = imagePath.split(".");
      const timestamp = Date.now();
      imagePath = `${nameParts[0]}_${timestamp}.${nameParts[1]}`;
    }

    const normalizedPath = this.normalizePath(imagePath);

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: normalizedPath,
          Body: Buffer.from(fileData, "base64"),
          ContentEncoding: "base64",
          ContentType: "image/jpeg",
        })
      );
    } catch (error: any) {
      throw new FileManagerError(
        `Failed to save image to '${imagePath}': ${error.message}`,
        "SAVE_IMAGE_FAILED",
        imagePath
      );
    }
  }

  async getLink({ path, expiresIn = 3600 }: GetLinkParams): Promise<string> {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    if (!(await this.exists(normalizedPath))) {
      throw new FileManagerError(`File '${path}' does not exist`, "FILE_NOT_FOUND", path);
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: normalizedPath,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error: any) {
      throw new FileManagerError(`Failed to generate link: ${error.message}`, "LINK_GENERATION_FAILED", path);
    }
  }

  async getThumb({ path }: GetThumbParams): Promise<Buffer | NodeJS.ReadableStream> {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    if (!(await this.exists(normalizedPath))) {
      throw new FileManagerError(`File '${path}' does not exist`, "FILE_NOT_FOUND", path);
    }

    try {
      return await this.getFileStream(normalizedPath);
    } catch (error: any) {
      throw new FileManagerError(`Failed to read file '${path}': ${error.message}`, "READ_FAILED", path);
    }
  }

  async getMetadata(path: string): Promise<FSItem | null> {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: normalizedPath,
      });

      const response = await this.s3Client.send(command);

      return {
        path: normalizedPath,
        name: this.getFileName(normalizedPath),
        created: response.LastModified?.toISOString() || "",
        modified: response.LastModified?.toISOString() || "",
        id: normalizedPath,
        type: ENTITY_CONST.FILE,
        size: response.ContentLength || 0,
        extension: nodePath.extname(normalizedPath),
        private: false,
      };
    } catch (error: any) {
      if (error.name === "NotFound") {
        return null;
      }
      throw new FileManagerError(`Failed to retrieve metadata for '${path}': ${error.message}`, "METADATA_ERROR", path);
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      const normalizedPath = this.normalizePath(path, false);

      // First, try HeadObjectCommand for files and folder markers
      try {
        const command = new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: normalizedPath,
        });
        await this.s3Client.send(command);
        return true;
      } catch (headError: any) {
        // If HeadObject fails, check if it's a folder (prefix with contents)
        if (headError.name === "NotFound" || headError.$metadata?.httpStatusCode === 404) {
          // Check if path is intended to be a folder
          const folderPrefix = normalizedPath.endsWith("/") ? normalizedPath : normalizedPath + "/";

          // List objects with this prefix to see if folder has contents
          const listCommand = new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: folderPrefix,
            MaxKeys: 1, // We just need to know if anything exists
          });

          const listResponse = await this.s3Client.send(listCommand);

          // Folder exists if it has contents OR common prefixes (subfolders)
          return !!(
            (listResponse.Contents && listResponse.Contents.length > 0) ||
            (listResponse.CommonPrefixes && listResponse.CommonPrefixes.length > 0)
          );
        }

        // Other errors, rethrow
        throw headError;
      }
    } catch (error) {
      return false;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async directoryTree(
    prefix: string,
    options: { withChildren?: boolean; includeFiles?: boolean }
  ): Promise<FSItem | null> {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix,
      Delimiter: "/",
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    const folderList = this.convertCommonPrefixes(response.CommonPrefixes || []);

    if (options.withChildren) {
      for (const folder of folderList) {
        const subFolderTree = await this.directoryTree(folder.path, options);
        folder.children = subFolderTree?.children || [];
      }
    }

    const children = options.includeFiles ? [...folderList, ...this.convertContents(response.Contents)] : folderList;

    return {
      path: prefix || "/",
      name: this.getFileName(prefix) || "root",
      created: "",
      id: String(Date.now()),
      modified: "",
      type: ENTITY_CONST.DIRECTORY,
      size: 0,
      children,
      private: false,
    };
  }

  private async listFolderContents(prefix: string): Promise<FSItem | null> {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix,
      Delimiter: "/",
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    const children = [
      ...this.convertCommonPrefixes(response.CommonPrefixes || []),
      ...this.convertContents(response.Contents),
    ];

    return {
      path: prefix,
      name: this.getFileName(prefix) || "root",
      created: "",
      id: String(Date.now()),
      modified: "",
      type: ENTITY_CONST.DIRECTORY,
      size: 0,
      children,
      private: false,
    };
  }

  private async searchInS3(prefix: string, searchText: string): Promise<FSItem[]> {
    const results: FSItem[] = [];
    let continuationToken: string | undefined;

    do {
      const params = {
        Bucket: this.bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      };

      const command = new ListObjectsV2Command(params);
      const response = await this.s3Client.send(command);

      const matchingItems = (response.Contents || []).filter((item) => {
        const fileName = this.getFileName(item.Key || "");
        return fileName.toLowerCase().includes(searchText);
      });

      results.push(...this.convertContents(matchingItems));
      continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    return results;
  }

  private convertCommonPrefixes(commonPrefixes: CommonPrefix[]): FSItem[] {
    return commonPrefixes.map((dir) => ({
      path: dir.Prefix || "",
      name: this.getFileName(dir.Prefix || ""),
      created: "",
      modified: "",
      id: (dir.Prefix || "") + Date.now(),
      type: ENTITY_CONST.DIRECTORY,
      children: [],
      size: 0,
      private: false,
    }));
  }

  private convertContents(contents?: _Object[]): FSItem[] {
    if (!Array.isArray(contents)) return [];

    return contents.reduce<FSItem[]>((result, file) => {
      const path = file.Key || "";
      const fileName = this.getFileName(path);

      if (!fileName || path.endsWith("/")) return result;

      const extension = nodePath.extname(fileName);

      result.push({
        path,
        name: fileName,
        created: String(file.LastModified || ""),
        modified: String(file.LastModified || ""),
        id: path,
        type: ENTITY_CONST.FILE,
        size: file.Size || 0,
        private: false,
        extension,
      });

      return result;
    }, []);
  }

  private async copyObject(sourcePath: string, destPath: string, isFolder: boolean) {
    if (isFolder) {
      // Ensure source ends with / and dest ends with /
      const normalizedSource = sourcePath.endsWith("/") ? sourcePath : sourcePath + "/";
      const normalizedDest = destPath.endsWith("/") ? destPath : destPath + "/";

      const listParams = {
        Bucket: this.bucketName,
        Prefix: normalizedSource,
      };

      const listCommand = new ListObjectsV2Command(listParams);
      const listResponse = await this.s3Client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        // Empty folder - create the folder marker
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: normalizedDest,
            Body: "",
          })
        );
        return;
      }

      await Promise.all(
        listResponse.Contents.map(async (object) => {
          const oldKey = object.Key || "";

          // Get the relative path from source
          const relativePath = oldKey.slice(normalizedSource.length);

          // Build new key preserving structure
          const newKey = normalizedDest + relativePath;

          await this.s3Client.send(
            new CopyObjectCommand({
              Bucket: this.bucketName,
              Key: newKey,
              CopySource: encodeURIComponent(`${this.bucketName}/${oldKey}`),
            })
          );
        })
      );

      // Create folder marker if it doesn't exist
      if (!listResponse.Contents.some((obj) => obj.Key === normalizedSource)) {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: normalizedDest,
            Body: "",
          })
        );
      }
    } else {
      await this.s3Client.send(
        new CopyObjectCommand({
          Bucket: this.bucketName,
          Key: destPath,
          CopySource: encodeURIComponent(`${this.bucketName}/${sourcePath}`),
        })
      );
    }
  }

  private async deleteObject(path: string, isFolder: boolean) {
    if (isFolder) {
      await this.deleteObjectsRecursively(path, false);
    } else {
      // Use individual DeleteObjectCommand instead of DeleteObjectsCommand
      // to avoid Content-MD5 requirement
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: path,
      });
      await this.s3Client.send(command);
    }
  }

  private async deleteObjectsRecursively(prefix: string, keepRoot: boolean) {
    let continuationToken: string | undefined;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const listResponse = await this.s3Client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) break;

      let objects = listResponse.Contents.map((obj) => ({ Key: obj.Key! }));

      if (keepRoot) {
        objects = objects.filter((obj) => obj.Key !== prefix);
      }

      // Delete objects one by one to avoid Content-MD5 requirement
      // This is more compatible with S3-compatible services
      if (objects.length > 0) {
        await Promise.all(
          objects.map(async (obj) => {
            const command = new DeleteObjectCommand({
              Bucket: this.bucketName,
              Key: obj.Key,
            });
            await this.s3Client.send(command);
          })
        );
      }

      continuationToken = listResponse.IsTruncated ? listResponse.NextContinuationToken : undefined;
    } while (continuationToken);
  }

  private async uploadToS3(key: string, body: Buffer, contentType: string) {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
    });

    await upload.done();
  }

  private async uploadStreamToS3(key: string, stream: Readable, contentType?: string) {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: stream,
        ContentType: contentType || "application/octet-stream",
      },
    });

    await upload.done();
  }

  private async getFileStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  private async addFolderToArchive(archive: archiver.Archiver, prefix: string, folderName: string) {
    const listParams = {
      Bucket: this.bucketName,
      Prefix: prefix,
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const listResponse = await this.s3Client.send(listCommand);

    if (!listResponse.Contents) return;

    for (const object of listResponse.Contents) {
      const key = object.Key || "";
      if (key === prefix || key.endsWith("/")) continue;

      const relativePath = key.slice(prefix.length);
      const stream = await this.getFileStream(key);
      archive.append(stream, { name: `${folderName}/${relativePath}` });
    }
  }

  private async generateUniqueCopyName(itemPath: string, isFolder: boolean, targetDir?: string): Promise<string> {
    const dir = targetDir || this.getParentPath(itemPath);
    const fileName = this.getFileName(itemPath);
    const ext = isFolder ? "" : nodePath.extname(fileName);
    const baseName = nodePath.basename(fileName, ext);

    let newName = `${baseName} copy${ext}${isFolder ? "/" : ""}`;
    let newPath = this.joinS3Path(dir, newName);
    let counter = 2;

    while (await this.exists(newPath)) {
      newName = `${baseName} copy ${counter}${ext}${isFolder ? "/" : ""}`;
      newPath = this.joinS3Path(dir, newName);
      counter++;
    }

    return newName;
  }

  private async generateUniqueNameInDirectory(targetDir: string, fileName: string, isFolder: boolean): Promise<string> {
    const ext = isFolder ? "" : nodePath.extname(fileName);
    const baseName = nodePath.basename(fileName, ext);
    const originalName = `${baseName}${ext}${isFolder ? "/" : ""}`;
    let newPath = this.joinS3Path(targetDir, originalName);

    if (!(await this.exists(newPath))) {
      return originalName;
    }

    let counter = 1;
    let newName: string;

    while (true) {
      newName = `${baseName} (${counter})${ext}${isFolder ? "/" : ""}`;
      newPath = this.joinS3Path(targetDir, newName);

      if (!(await this.exists(newPath))) {
        return newName;
      }

      counter++;
    }
  }

  // ============================================================================
  // OVERRIDDEN METHODS FROM BASE CLASS
  // ============================================================================

  private normalizePath(path: string, throwError: boolean = true): string {
    // For S3, we don't need the strict rootFolder validation from base class
    // S3 paths are relative to bucket root

    if (typeof path !== "string" || path.trim() === "" || path === "/") {
      return "";
    }

    return path;
    // Check for path traversal attempts
    if (/(\.\.\/|\.\.\\|\.\/|\.\\|^\/$)/.test(path)) {
      if (throwError) {
        throw new FileManagerError("Path contains traversal attempts", "DANGEROUS_PATH", path);
      }
      return "";
    }

    // Remove leading slash if present
    let normalized = path.startsWith("/") ? path.substring(1) : path;

    // Remove any double slashes
    normalized = normalized.replace(/\/+/g, "/");

    return normalized;
  }

  private joinS3Path(...parts: string[]): string {
    return parts
      .map((part) => part.replace(/^\/+|\/+$/g, ""))
      .filter((part) => part.length > 0)
      .join("/");
  }

  private getParentPath(path: string): string {
    const normalized = path.endsWith("/") ? path.slice(0, -1) : path;
    const parts = normalized.split("/");
    parts.pop();
    return parts.length > 0 ? parts.join("/") + "/" : "";
  }

  private getFileName(path: string): string {
    const normalized = path.endsWith("/") ? path.slice(0, -1) : path;
    const parts = normalized.split("/");
    return parts[parts.length - 1] || "";
  }
}

export default S3BucketFileManagerProvider;
