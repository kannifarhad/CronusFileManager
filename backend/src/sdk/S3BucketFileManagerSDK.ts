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
import fsExtra from "fs-extra";
import FileManagerSDKBase, { FileManagerError } from "./FileManagerSDKBase";

import {
  DirectoryTreeOptions,
  ENTITY_CONST,
  EntityType,
  FSItem,
  FSPermissions,
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
  FileManagerSDKBaseConfig,
} from "./types";
import { sanitizePath } from "./helpers/sanitazePath";

export interface FileManagerConfig extends FileManagerSDKBaseConfig {
  tempFolder: string;
}

export class S3BucketFileManagerSDK extends FileManagerSDKBase {
  protected config: FileManagerConfig;
  protected coreFolder: string;
  private readonly basePath: string;

  constructor(config: FileManagerConfig) {
    super(config);
    this.config = config;
    this.coreFolder = process.cwd();
    this.basePath = `/${this.config.rootFolder}`;
  }

  async getFolderTree({ prefix = "/", withChildren = true, includeFiles = false }) {
    try {
      return await this.directoryTree(prefix, {
        withChildren,
        includeFiles,
        normalizePath: true,
        removePath: this.coreFolder,
      });
    } catch (error: any) {
      throw new FileManagerError(`Failed to retrieve folder tree: ${error.message}`, "FOLDER_TREE_ERROR", prefix);
    }
  }

  async getFolderInfo(path: string) {
    try {
      return await this.directoryTree(path, {
        withChildren: true,
        childrenDepth: 1,
        includeFiles: true,
        normalizePath: true,
        removePath: this.coreFolder,
      });
    } catch (error: any) {
      throw new FileManagerError(
        `Failed to retrieve folder info for '${path}': ${error.message}`,
        "FOLDER_INFO_ERROR",
        path
      );
    }
  }

  async search({ text, path = "" }: SearchParams) {
    if (!text || text.trim().length === 0) {
      throw new FileManagerError("Search text cannot be empty", "INVALID_SEARCH_TEXT");
    }

    try {
      const escapedPath = this.normalizePath(path);
      return await this.searchDirectoryTree(escapedPath, text, {
        normalizePath: true,
        removePath: this.coreFolder,
        includeFiles: true,
        withChildren: true,
      });
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

    const sanitazedName = sanitizePath(newname, { strict: true });
    const normalizedPath = this.normalizePath(path);

    if (!(await this.isEntityExists(normalizedPath))) {
      throw new FileManagerError(`Item '${path}' does not exist`, "ITEM_NOT_FOUND", path);
    }

    const renamePath = nodePath.join(nodePath.dirname(normalizedPath), sanitazedName);

    if (await this.isEntityExists(renamePath)) {
      throw new FileManagerError(`Item with name '${newname}' already exists`, "ITEM_EXISTS", path);
    }

    try {
      await fsExtra.rename(normalizedPath, renamePath);
    } catch (error: any) {
      throw new FileManagerError(`Failed to rename '${path}' to '${newname}': ${error.message}`, "RENAME_FAILED", path);
    }
  }

  async delete({ items }: DeleteParams) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new FileManagerError("No items provided for deletion", "NO_ITEMS");
    }

    const normalisedPaths = items.map((path) => this.normalizePath(path));
    const errors: Array<{ path: string; error: string }> = [];
    await Promise.allSettled(
      normalisedPaths.map(async (item: string) => {
        try {
          await fsExtra.remove(item);
        } catch (err: any) {
          errors.push({ path: item, error: err.message });
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

  async createFile({ path, file }: CreateFileParams) {
    if (!this.checkVariables([path, file])) {
      throw new FileManagerError("Path and filename are required", "MISSING_PARAMETERS");
    }

    if (!this.checkExtension(nodePath.extname(file))) {
      throw new FileManagerError(`Invalid or unaccepted file format '${file}'`, "INVALID_EXTENSION");
    }

    const normalizedPath = this.normalizePath(path);
    const fullFilePath = nodePath.join(normalizedPath, sanitizePath(file, { strict: true }));

    if (await this.isEntityExists(fullFilePath)) {
      throw new FileManagerError(`File '${file}' already exists in '${path}'`, "FILE_EXISTS", fullFilePath);
    }

    try {
      await fsExtra.ensureFile(fullFilePath);
    } catch (error: any) {
      throw new FileManagerError(
        `Failed to create file '${file}': ${error.message}`,
        "CREATE_FILE_FAILED",
        fullFilePath
      );
    }
  }

  async createFolder({ path, folder, mask = 0o777 }: CreateFolderParams) {
    if (!this.checkVariables([path, folder])) {
      throw new FileManagerError("Path and folder name are required", "MISSING_PARAMETERS");
    }

    const normalisedPath = this.normalizePath(path);
    const sanitisedFolderName = sanitizePath(folder, { strict: true });

    const newFolderPath = nodePath.join(normalisedPath, sanitisedFolderName);

    if (await this.isEntityExists(newFolderPath)) {
      throw new FileManagerError(`Folder '${folder}' already exists in '${path}'`, "FOLDER_EXISTS", normalisedPath);
    }

    try {
      await fsExtra.mkdir(newFolderPath, { mode: mask });
    } catch (error: any) {
      throw new FileManagerError(
        `Failed to create folder '${folder}': ${error.message}`,
        "CREATE_FOLDER_FAILED",
        path + folder
      );
    }
  }

  async emptyDir({ path }: EmptyDirParams) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalisedPath = this.normalizePath(path);

    if (!(await this.isEntityExists(normalisedPath))) {
      throw new FileManagerError(`Directory '${path}' does not exist`, "DIRECTORY_NOT_FOUND", path);
    }

    try {
      await fsExtra.emptyDir(normalisedPath);
    } catch (error: any) {
      throw new FileManagerError(`Failed to empty directory '${path}': ${error.message}`, "EMPTY_DIR_FAILED", path);
    }
  }

  async duplicate({ path }: DuplicateParams) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalisedPath = this.normalizePath(path);

    if (!(await this.isEntityExists(normalisedPath))) {
      throw new FileManagerError(`Item '${path}' does not exist`, "ITEM_NOT_FOUND", path);
    }

    try {
      const dublicatePath = await this.generateUniqueNameInDirectoryV2({
        fullPath: normalisedPath,
        prefix: "copy",
      });

      await fsExtra.copy(normalisedPath, dublicatePath);
      return dublicatePath;
    } catch (error: any) {
      throw new FileManagerError(`Failed to duplicate '${path}': ${error.message}`, "DUPLICATE_FAILED", normalisedPath);
    }
  }

  async copy({ items, destination }: CopyParams) {
    if (!this.checkVariables([destination])) {
      throw new FileManagerError("Destination is required", "MISSING_PARAMETERS");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new FileManagerError("No items provided for copying", "NO_ITEMS");
    }

    const escapedDestination = this.normalizePath(destination);

    if (!(await this.isEntityExists(escapedDestination))) {
      throw new FileManagerError(`Destination '${destination}' does not exist`, "DESTINATION_NOT_FOUND", destination);
    }

    const errors: Array<{ path: string; error: string }> = [];

    await Promise.allSettled(
      items.map(async (itemPath: string) => {
        try {
          const normalizedPath = this.normalizePath(itemPath);

          if (!(await this.isEntityExists(normalizedPath))) {
            errors.push({ path: itemPath, error: "Item does not exist" });
            return;
          }

          // Get the original name
          const ext = nodePath.extname(normalizedPath) ?? "";
          const baseName = nodePath.basename(normalizedPath, ext);
          const originalName = `${baseName}${ext}`;

          // Check if file with same name exists in destination
          const finalDest = await this.generateUniqueNameInDirectoryV2({
            fullPath: nodePath.join(escapedDestination, originalName),
            prefix: "copy",
          });

          await fsExtra.copy(normalizedPath, finalDest, { overwrite: false });
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
    if (!this.checkVariables([destination])) {
      throw new FileManagerError("Destination is required", "MISSING_PARAMETERS");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new FileManagerError("No items provided for moving", "NO_ITEMS");
    }

    const escapedDestination = this.normalizePath(destination);

    if (!(await this.isEntityExists(escapedDestination))) {
      throw new FileManagerError(`Destination '${destination}' does not exist`, "DESTINATION_NOT_FOUND", destination);
    }

    const errors: Array<{ path: string; error: string }> = [];

    await Promise.allSettled(
      items.map(async (itemPath: string) => {
        try {
          const normalizedPath = this.normalizePath(itemPath);

          if (!(await this.isEntityExists(normalizedPath))) {
            errors.push({ path: itemPath, error: "Item does not exist" });
            return;
          }

          // Get the original name
          const ext = nodePath.extname(normalizedPath) ?? "";
          const baseName = nodePath.basename(normalizedPath, ext);
          const originalName = `${baseName}${ext}`;

          // Check if file with same name exists in destination
          const finalDest = await this.generateUniqueNameInDirectoryV2({
            fullPath: nodePath.join(escapedDestination, originalName),
            prefix: "copy",
          });

          await fsExtra.move(normalizedPath, finalDest, { overwrite: false });
        } catch (err: any) {
          errors.push({ path: itemPath, error: err.message });
        }
      })
    );

    if (errors.length > 0) {
      const errorDetails = errors.map((e) => `${e.path}: ${e.error}`).join("; ");
      throw new FileManagerError(
        `Failed to move ${errors.length} of ${items.length} items: ${errorDetails}`,
        "MOVE_FAILED"
      );
    }
  }

  async unzip({ file, destination = "" }: UnzipParams) {
    if (!this.checkVariables([file])) {
      throw new FileManagerError("File path is required", "MISSING_PARAMETERS");
    }

    const normalisedArchivePath = this.normalizePath(file);

    if (!(await this.isEntityExists(normalisedArchivePath))) {
      throw new FileManagerError(`Archive '${file}' does not exist`, "FILE_NOT_FOUND", file);
    }

    const normalisedDestination =
      destination === "" ? normalisedArchivePath.split(".").shift()! : this.normalizePath(destination);

    try {
      const zip = fsExtra.createReadStream(normalisedArchivePath).pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of zip) {
        const entryPath = entry.path as string;

        if (!this.checkExtension(nodePath.extname(entryPath))) {
          entry.autodrain();
          continue;
        }

        // Check if file with same name exists in destination
        const fullOutPath = await this.generateUniqueNameInDirectoryV2({
          fullPath: nodePath.join(normalisedDestination, entryPath),
          prefix: "copy",
        });
        await fsExtra.ensureDir(nodePath.dirname(fullOutPath));
        entry.pipe(fsExtra.createWriteStream(fullOutPath));
      }
    } catch (error: any) {
      throw new FileManagerError(`Failed to unzip '${file}': ${error.message}`, "UNZIP_FAILED", file);
    }
  }

  async archive({ files, destination, name }: ArchiveParams) {
    if (!this.checkVariables([destination, name]) || !Array.isArray(files) || files.length === 0) {
      throw new FileManagerError("Destination, name, and files are required", "MISSING_PARAMETERS");
    }

    const sanitazedName = sanitizePath(name, { strict: true });
    const normalisedDestination = this.normalizePath(destination);

    if (!(await this.isEntityExists(normalisedDestination))) {
      throw new FileManagerError(`Destination '${destination}' does not exist`, "DESTINATION_NOT_FOUND", destination);
    }

    const archivePath = nodePath.join(normalisedDestination, `${sanitazedName}.zip`);

    try {
      const output = fsExtra.createWriteStream(archivePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      await new Promise((resolve, reject) => {
        archive.pipe(output);

        archive.on("error", (err) => {
          reject(new FileManagerError(`Archive creation error: ${err.message}`, "ARCHIVE_ERROR"));
        });

        output.on("error", (err) => {
          reject(new FileManagerError(`Output stream error: ${err.message}`, "STREAM_ERROR"));
        });

        output.on("close", () => {
          resolve(nodePath.join(destination, `${name}.zip`));
        });

        // Add files to archive
        Promise.all(
          files.map(async (itemPath) => {
            const normalizedPath = this.normalizePath(itemPath);

            if (!(await this.isEntityExists(normalizedPath))) {
              console.warn(`Skipping non-existent file: ${itemPath}`);
              return;
            }

            const fileName = nodePath.basename(normalizedPath);
            const stats = await fsExtra.lstat(normalizedPath);

            if (stats.isDirectory()) {
              archive.directory(normalizedPath, fileName);
            } else {
              archive.file(normalizedPath, { name: fileName });
            }
          })
        )
          .then(() => {
            archive.finalize();
          })
          .catch(reject);
      });

      return archivePath;
    } catch (error: any) {
      throw new FileManagerError(`Failed to create archive: ${error.message}`, "ARCHIVE_FAILED", archivePath);
    }
  }

  async saveImage({ file, isnew, path }: SaveImageParams) {
    if (!this.checkVariables([path]) || !file) {
      throw new FileManagerError("Path and file data are required", "MISSING_PARAMETERS");
    }

    const fileData = typeof file === "string" ? file.split(";base64,").pop()! : file;

    if (!this.checkExtension(nodePath.extname(path))) {
      throw new FileManagerError(`Invalid image format for '${path}'`, "INVALID_EXTENSION", path);
    }
    const imagePath = this.normalizePath(path);
    const escapedPath = isnew
      ? await this.generateUniqueNameInDirectoryV2({
          fullPath: imagePath,
          prefix: "copy",
        })
      : imagePath;

    try {
      await fsExtra.ensureDir(nodePath.dirname(escapedPath));
      await fsExtra.writeFile(escapedPath, fileData, { encoding: "base64" });
    } catch (error: any) {
      throw new FileManagerError(
        `Failed to save image to '${imagePath}': ${error.message}`,
        "SAVE_IMAGE_FAILED",
        imagePath
      );
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

    if (!(await this.isEntityExists(normalizedPath))) {
      throw new FileManagerError(`Destination '${path}' does not exist`, "DESTINATION_NOT_FOUND", path);
    }

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
            fileMaps.find((map) => map.name === fileOriginalName)?.path ?? fileOriginalName
          );

          const data = await fsExtra.readFile(file.path!);
          // Check if file exists and generate unique name if needed
          const fullPath = await this.generateUniqueNameInDirectoryV2({
            fullPath: nodePath.join(normalizedPath, relativePath),
            prefix: "copy",
          });
          await fsExtra.ensureDir(nodePath.dirname(fullPath));
          await fsExtra.writeFile(fullPath, data);
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

  async getLink({ path }: GetLinkParams) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    if (!(await this.isEntityExists(normalizedPath))) {
      throw new FileManagerError(`File '${path}' does not exist`, "FILE_NOT_FOUND", path);
    }

    return normalizedPath;
  }

  async getThumb({ path }: GetThumbParams) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    if (!(await this.isEntityExists(normalizedPath))) {
      throw new FileManagerError(`File '${path}' does not exist`, "FILE_NOT_FOUND", path);
    }

    try {
      return fsExtra.createReadStream(normalizedPath);
    } catch (error: any) {
      throw new FileManagerError(`Failed to read file '${path}': ${error.message}`, "READ_FAILED", path);
    }
  }

  async getMetadata(path: string) {
    if (!this.checkVariables([path])) {
      throw new FileManagerError("Path is required", "MISSING_PARAMETERS");
    }

    const normalizedPath = this.normalizePath(path);

    if (!(await this.isEntityExists(normalizedPath))) {
      throw new FileManagerError(`Item '${path}' does not exist`, "ITEM_NOT_FOUND", path);
    }

    try {
      return await this.getItemInfoAsync(normalizedPath, {
        normalizePath: true,
        removePath: this.coreFolder,
      });
    } catch (error: any) {
      throw new FileManagerError(`Failed to retrieve metadata for '${path}': ${error.message}`, "METADATA_ERROR", path);
    }
  }

  async exists(path: string) {
    try {
      const escapedPath = this.normalizePath(path, false);
      return await this.isEntityExists(escapedPath);
    } catch {
      return false;
    }
  }

  /**
   * Recursively collects files/folders for a directory path.
   * Optimized for performance with parallel processing and reduced I/O operations.
   */
  protected async directoryTree(
    path: string,
    options: DirectoryTreeOptions,
    onEachFile?: (item: FSItem, path: typeof nodePath, stats: fsExtra.Stats) => void,
    onEachDirectory?: (item: FSItem, path: typeof nodePath, stats: fsExtra.Stats) => void,
    isRecursiveCall: boolean = false,
    currentDepth: number = 0
  ): Promise<FSItem | null> {
    const fullPath = isRecursiveCall ? path : this.normalizePath(path, true);

    try {
      const item = await this.getItemInfoAsync(fullPath, options);

      if (options?.exclude) {
        const excludes = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
        if (excludes.some((exclusion) => exclusion.test(fullPath))) {
          return null;
        }
      }

      if (item.type === ENTITY_CONST.FILE) {
        if (!options.includeFiles) return null;

        const ext = nodePath.extname(fullPath).toLowerCase();
        if (options.extensions && !options.extensions.test(ext)) return null;

        if (onEachFile) {
          const stats = await fsExtra.stat(fullPath);
          onEachFile(item, nodePath, stats);
        }

        return item;
      }

      if (item.type === ENTITY_CONST.DIRECTORY) {
        const skipChildren =
          options.withChildren === false ||
          (options.childrenDepth !== undefined && currentDepth >= options.childrenDepth);

        if (skipChildren) {
          return item;
        }

        const dirData = await this.safeReadDirAsync(fullPath);
        if (dirData === null) return null;

        const children = await this.processChildrenInBatches(
          dirData.map((child) => nodePath.join(fullPath, child)),
          options,
          onEachFile,
          onEachDirectory,
          currentDepth + 1
        );

        item.children = children.filter((e): e is FSItem => !!e);
        item.size = item.children.reduce((prev, cur) => prev + (cur.size || 0), 0);

        if (onEachDirectory) {
          const stats = await fsExtra.stat(fullPath);
          onEachDirectory(item, nodePath, stats);
        }

        return item;
      }

      return null;
    } catch (e: any) {
      console.error(`Error retrieving info for ${fullPath}: ${e.message}`);
      return null;
    }
  }

  protected async searchDirectoryTree(
    dir: string,
    searchString: string,
    options: DirectoryTreeOptions = {}
  ): Promise<FSItem[]> {
    const results: FSItem[] = [];
    const items = await this.safeReadDirAsync(dir);
    if (!items) return results;

    const searchLower = searchString.toLowerCase();

    await Promise.all(
      items.map(async (item) => {
        const fullPath = nodePath.join(dir, item);

        try {
          const treeItem = await this.getItemInfoAsync(fullPath, options);

          if (nodePath.basename(fullPath).toLowerCase().includes(searchLower)) {
            results.push(treeItem);
          }

          if (treeItem.type === ENTITY_CONST.DIRECTORY) {
            const subItems = await this.searchDirectoryTree(fullPath, searchString, options);
            results.push(...subItems);
          }
        } catch (e: any) {
          console.error(`Error searching ${fullPath}: ${e.message}`);
        }
      })
    );

    return results;
  }

  /**
   * Process children in batches to avoid overwhelming the system with concurrent operations
   */
  private async processChildrenInBatches(
    paths: string[],
    options: DirectoryTreeOptions,
    onEachFile?: (item: FSItem, path: typeof nodePath, stats: fsExtra.Stats) => void,
    onEachDirectory?: (item: FSItem, path: typeof nodePath, stats: fsExtra.Stats) => void,
    currentDepth: number = 0,
    batchSize: number = 100
  ): Promise<(FSItem | null)[]> {
    const results: (FSItem | null)[] = [];

    for (let i = 0; i < paths.length; i += batchSize) {
      const batch = paths.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((childPath) =>
          this.directoryTree(childPath, options, onEachFile, onEachDirectory, true, currentDepth)
        )
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Generates a unique name in a directory (for copy/move/upload/unzip operations)
   * Only adds numbering if there's a conflict, otherwise returns original name
   */

  protected async generateUniqueNameInDirectoryV2({
    fullPath,
    prefix = "copy",
  }: {
    fullPath: string;
    prefix?: string;
  }): Promise<string> {
    // If there's no conflict, return the original full path
    if (!(await this.isEntityExists(fullPath))) {
      return fullPath;
    }

    const dir = nodePath.dirname(fullPath);
    const ext = nodePath.extname(fullPath) || "";
    const baseName = nodePath.basename(fullPath, ext);

    // Try: "<baseName> copy"
    let newPath = nodePath.join(dir, `${baseName} ${prefix}${ext}`);
    if (prefix && !(await this.isEntityExists(newPath))) {
      return newPath;
    }

    // If it exists, start iterating: "<baseName> copy (2)", "<baseName> copy (3)", etc.
    let counter = 1;
    while (true) {
      let newName = `${baseName} ${prefix}(${counter})${ext}`;
      newPath = nodePath.join(dir, newName);

      if (!(await this.isEntityExists(newPath))) {
        return newPath;
      }

      counter++;
    }
  }

  protected async getItemInfoAsync(fullPath: string, options: DirectoryTreeOptions): Promise<FSItem> {
    const stats = await fsExtra.stat(fullPath);
    //TODO: Add support for symlinks
    // const stats = await fsExtra.lstat(fullPath);
    // if (stats.isSymbolicLink()) {
    // }
    const name = nodePath.basename(fullPath);
    const isDirectory = stats.isDirectory();
    const type: EntityType = isDirectory ? ENTITY_CONST.DIRECTORY : ENTITY_CONST.FILE;
    const itemPath = this.computeItemPath(fullPath, options);

    const treeItem: FSItem = {
      path: itemPath,
      name,
      created: stats.birthtime,
      modified: stats.mtime,
      id: `${type}_${stats.ino}`,
      premissions: this.permissionsConvert(stats.mode),
      type,
    };

    if (type === ENTITY_CONST.FILE) {
      const ext = nodePath.extname(fullPath).toLowerCase();
      treeItem.size = stats.size;
      treeItem.extension = ext;
    }

    return treeItem;
  }

  private computeItemPath(fullPath: string, options: DirectoryTreeOptions): string {
    if (!options?.normalizePath && !options?.removePath) {
      return fullPath;
    }

    const normalizedPath = fullPath.replace(/\\/g, "/");

    if (options.removePath) {
      const normalizedRemovePath = options.removePath.replace(/\\/g, "/");
      return normalizedPath.replace(normalizedRemovePath, "");
    }

    return normalizedPath;
  }

  /**
   * Returns a fully resolveda absolute and validated sanitized path.
   */
  protected normalizePath(path: string, strict: boolean = true): string {
    const rootPath = nodePath.join(this.coreFolder, this.basePath);

    if (typeof path !== "string" || path.trim() === "" || path.trim() === "/") {
      return rootPath;
    }

    if (!path.startsWith(this.basePath)) {
      if (strict) throw new FileManagerError(`Path must start with "${this.basePath}"`, "INVALID_BASE_PATH", path);
      return rootPath;
    }

    // Check for directory traversal attempts
    const sanitazedPath = sanitizePath(path, { strict });
    return nodePath.join(this.coreFolder, sanitazedPath);
  }

  protected permissionsConvert(mode: number): FSPermissions {
    const formatPerm = (shift: number): string => {
      const val = (mode >> shift) & 7;
      return (val & 4 ? "r" : "") + (val & 2 ? "w" : "") + (val & 1 ? "x" : "");
    };

    return {
      owner: formatPerm(6),
      group: formatPerm(3),
      others: formatPerm(0),
    };
  }

  protected async safeReadDirAsync(path: string): Promise<string[] | null> {
    try {
      return await fsExtra.readdir(path);
    } catch (ex: any) {
      if (ex.code === "EACCES" || ex.code === "EPERM") {
        return null;
      }
      throw ex;
    }
  }

  protected async isEntityExists(path: string): Promise<boolean> {
    try {
      await fsExtra.access(path, fsExtra.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}

export default S3BucketFileManagerSDK;
