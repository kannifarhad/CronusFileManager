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
import fs from "graceful-fs";
import fsExtra from "fs-extra";

// Use fs.promises from graceful-fs
const fsPromises = fs.promises;

import AbstractFileManager, {
  FolderTreeOptions,
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
  AbstractFileManagerConfig,
} from "./AbstractFileManager";
import { DirectoryTreeOptions, ENTITY_CONST, EntityType, FSItem, FSPermissions } from "./types";

export interface FileManagerConfig extends AbstractFileManagerConfig {
  tempFolder: string; // Temporary folder for operations
}

export class LocalFileManagerSDK extends AbstractFileManager {
  protected config: FileManagerConfig;
  protected coreFolder: string;
  private readonly basePath: string;

  constructor(config: FileManagerConfig) {
    super(config);
    this.config = config;
    this.coreFolder = process.cwd();
    this.basePath = `/${this.config.rootFolder}`;
  }

  async getFolderTree({ prefix = "", withChildren = true, includeFiles = false }: FolderTreeOptions) {
    return this.directoryTree(prefix, {
      withChildren,
      includeFiles,
      normalizePath: true,
      removePath: this.coreFolder,
    });
  }

  async getFolderInfo(path: string) {
    return this.directoryTree(path, {
      withChildren: true,
      childrenDepth: 1,
      includeFiles: true,
      normalizePath: true,
      removePath: this.coreFolder,
    });
  }

  async search({ text, path = "" }: SearchParams): Promise<FSItem[]> {
    const escapedPath = this.normalizePath(path);

    return this.searchDirectoryTree(escapedPath, text, {
      normalizePath: true,
      removePath: this.coreFolder,
      includeFiles: true,
      withChildren: true,
    });
  }

  async rename({ path, newname }: RenameParams) {
    const escapedPath = this.normalizePath(path);

    if (!this.checkVariables([path, newname])) {
      throw new Error(`Variables not set!`);
    }

    if (!this.checkExtension(nodePath.extname(newname))) {
      throw new Error(`Wrong File Format ${newname}`);
    }

    if (this.isDangerousPath(newname)) {
      throw new Error(`Newname contains traversal attempts. ${newname}`);
    }

    if (!(await this.isEntityExists(escapedPath))) {
      throw new Error(`Target item dont exists. ${path}`);
    }

    const editPath = [...escapedPath.split("/")];
    editPath.pop();
    editPath.push(newname);
    const renamePath = editPath.join("/");

    if (await this.isEntityExists(renamePath)) {
      throw new Error(`There is already existing file with new name. ${newname}`);
    }

    return fs.promises.rename(escapedPath, renamePath).catch((e) => {
      console.error(e);
      throw new Error(`Couldnt rename item.`);
    });
  }

  async delete({ items }: DeleteParams): Promise<void> {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error(`Items are empty. Nothing had been passed to be deleted!`);
    }

    const normalisedPaths = items.map((path) => this.normalizePath(path));
    const errorDeleted: string[] = [];
    await Promise.all(
      normalisedPaths.map(async (item: string) => {
        try {
          await fsExtra.remove(item);
        } catch (err) {
          errorDeleted.push(item);
        }
      })
    );

    if (errorDeleted.length > 0) {
      throw new Error(`Not all items removed! ${errorDeleted.length} items remained in place.`);
    }
  }

  async createFile({ path, file }: CreateFileParams): Promise<void> {
    if (!this.checkVariables([path, file])) {
      throw new Error(`Variables not set!`);
    }

    if (!this.checkExtension(nodePath.extname(file))) {
      throw new Error(`Wrong or unaccepted file format ${file}`);
    }

    if (this.isDangerousPath(file)) {
      throw new Error(`Newname contains traversal attempts. ${file}`);
    }
    const escapedPath = this.normalizePath(path);
    const fullFilePath = nodePath.join(escapedPath, file);

    if (await this.isEntityExists(fullFilePath)) {
      throw new Error(`There is already existing file with new name. ${file}`);
    }

    const fd = await fsExtra.promises.open(fullFilePath, "wx");
    return fd.close();
  }

  async createFolder({ path, folder, mask = 0o777 }: CreateFolderParams): Promise<void> {
    if (this.isDangerousPath(folder)) {
      throw new Error(`New folder name contains traversal attempts. ${folder}`);
    }
    const newFolderPath = nodePath.join(path, folder);
    const escapedPath = this.normalizePath(newFolderPath);

    if (await this.isEntityExists(escapedPath)) {
      throw new Error(`There is already existing folder with this name. ${newFolderPath}`);
    }
    await fs.promises.mkdir(escapedPath, { mode: mask });
  }

  async emptyDir({ path }: EmptyDirParams): Promise<void> {
    const escapedPath = this.normalizePath(path);
    return fsExtra.emptyDir(escapedPath);
  }

  async duplicate({ path: targetPath }: DuplicateParams) {
    if (!this.checkVariables([targetPath])) {
      throw new Error("Variables not set!");
    }

    const escapedPath = this.normalizePath(targetPath);
    const stats = await fsExtra.stat(escapedPath);
    const isDirectory = stats.isDirectory();

    const copyName = await this.generateUniqueCopyName(escapedPath, isDirectory);
    const dir = nodePath.dirname(escapedPath);
    const copyPath = nodePath.join(dir, copyName);

    await fsExtra.copy(escapedPath, copyPath);
    return copyName;
  }

  async copy({ items, destination }: CopyParams): Promise<void> {
    if (!this.checkVariables([destination])) {
      throw new Error("Variables not set!");
    }

    const escapedDestination = this.normalizePath(destination);
    const normalisedPaths = items
      .map((itemPath) => this.normalizePath(itemPath))
      .filter((item) => this.isEntityExists(item));

    const errorCopy: string[] = [];

    await Promise.all(
      normalisedPaths.map(async (item: string) => {
        try {
          const stats = await fsExtra.stat(item);
          const isDirectory = stats.isDirectory();
          const newName = await this.generateUniqueCopyName(item, isDirectory, escapedDestination);
          const newDest = nodePath.join(escapedDestination, newName);

          await fsExtra.copy(item, newDest, { overwrite: false });
        } catch (err) {
          errorCopy.push(item);
        }
      })
    );

    if (errorCopy.length > 0) {
      throw new Error(`Not all items copied! ${errorCopy.length} of ${items.length} items failed to copy.`);
    }
  }

  async move({ items, destination }: MoveParams): Promise<void> {
    if (!this.checkVariables([destination])) {
      throw new Error("Variables not set!");
    }

    const escapedDestination = this.normalizePath(destination);
    const normalisedPaths = items
      .map((itemPath) => this.normalizePath(itemPath))
      .filter((item) => this.isEntityExists(item));

    await Promise.all(
      normalisedPaths.map(async (item: string) => {
        const stats = await fsExtra.stat(item);
        const isDirectory = stats.isDirectory();
        const newName = await this.generateUniqueCopyName(item, isDirectory, escapedDestination);
        const newDest = nodePath.join(escapedDestination, newName);

        await fsExtra.move(item, newDest, { overwrite: false });
      })
    );
  }

  async unzip({ file, destination = "" }: UnzipParams) {
    if (!this.checkVariables([file])) {
      throw new Error("Variables not set!");
    }
    const escapedFile = this.normalizePath(file);
    const escapedDestination = destination === "" ? escapedFile.split(".").shift()! : this.normalizePath(destination);

    const zip = fs.createReadStream(escapedFile).pipe(unzipper.Parse({ forceStream: true }));

    for await (const entry of zip) {
      if (this.checkExtension(nodePath.extname(entry.path))) {
        const outPath = nodePath.join(escapedDestination, entry.path);
        await fs.promises.mkdir(nodePath.dirname(outPath), { recursive: true });
        entry.pipe(fs.createWriteStream(outPath));
      } else {
        entry.autodrain();
      }
    }
  }

  async archive({ files, destination, name }: ArchiveParams): Promise<string> {
    if (!this.checkVariables([destination, name]) || !Array.isArray(files)) {
      throw new Error("Variables not set!");
    }
    const escapedDestination = this.normalizePath(destination);
    const normalisedFiles = files
      .map((itemPath) => this.normalizePath(itemPath))
      .filter((item) => this.isEntityExists(item));

    if (this.isDangerousPath(name)) {
      throw new Error(`Newname contains traversal attempts. ${name}`);
    }

    const output = fs.createWriteStream(nodePath.join(escapedDestination, `${name}.zip`));
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.on("error", (err) => {
      throw new Error(err.message);
    });

    for (const item of normalisedFiles) {
      const fileName = nodePath.basename(item);
      if ((await fs.promises.lstat(item)).isDirectory()) {
        archive.directory(item, fileName);
      } else {
        archive.file(item, { name: fileName });
      }
    }

    await archive.finalize();
    await output.on("close", () => {});
    return nodePath.join(destination, `${name}.zip`);
  }

  async saveImage({ file, isnew, path }: SaveImageParams): Promise<void> {
    if (!this.checkVariables([path]) || !Array.isArray(file)) {
      throw new Error("Variables not set!");
    }
    const escapedPath = this.normalizePath(path);

    file = file.split(";base64,").pop()!;
    if (!this.checkExtension(nodePath.extname(escapedPath))) {
      throw new Error(`Wrong File Format ${path}`);
    }

    if (isnew) {
      const nameParts = path.split(".");
      const timestamp = Date.now();
      path = `${nameParts[0]}_${timestamp}.${nameParts[1]}`;
    }

    await fs.promises.mkdir(nodePath.dirname(escapedPath), { recursive: true });
    await fs.promises.writeFile(escapedPath, file, { encoding: "base64" });
  }

  async uploadFiles({ files, fileMaps = [], path }: UploadFilesParams) {
    const escapedPath = this.normalizePath(path);

    if (!files || files.length === 0) {
      throw new Error("No files have been sent or files list is empty");
    }

    await Promise.all(
      files.map(async (file) => {
        const fileOriginalName = Buffer.from(file.originalname, "latin1").toString("utf8");
        if (!this.checkExtension(nodePath.extname(fileOriginalName))) return;

        const data = await fs.promises.readFile(file.path!);
        const relativePath = fileMaps.find((map) => map.name === fileOriginalName)?.path ?? `/${fileOriginalName}`;

        if (this.isDangerousPath(relativePath)) return;

        const fullPath = nodePath.join(escapedPath, relativePath);
        await fs.promises.mkdir(nodePath.dirname(fullPath), { recursive: true });
        await fs.promises.writeFile(fullPath, data);
      })
    );
  }
  async getLink({ path }: GetLinkParams): Promise<string> {
    const escapedPath = this.normalizePath(path);
    if (await this.isEntityExists(escapedPath)) {
      return escapedPath;
    }
    throw new Error("File doesnt exists");
  }

  async getThumb(params: GetThumbParams): Promise<Buffer | NodeJS.ReadableStream> {
    throw new Error("Method not implemented.");
  }

  async getMetadata(path: string): Promise<FSItem> {
    throw new Error("Method not implemented.");
  }

  async exists(path: string): Promise<boolean> {
    const escapedPath = this.normalizePath(path);
    return this.isEntityExists(escapedPath);
  }

  /**
   * Generates a unique copy name for a file or folder
   * @param itemPath - Full path to the item
   * @param isDirectory - Whether the item is a directory
   * @param targetDir - Optional target directory (defaults to item's parent directory)
   * @returns The unique name (not the full path)
   */
  protected async generateUniqueCopyName(itemPath: string, isDirectory: boolean, targetDir?: string): Promise<string> {
    const dir = targetDir || nodePath.dirname(itemPath);
    const ext = isDirectory ? "" : nodePath.extname(itemPath);
    const baseName = nodePath.basename(itemPath, ext);

    let newName = `${baseName} copy${ext}`;
    let newPath = nodePath.join(dir, newName);
    let counter = 2;

    // Iterate until we find a non-existing copy name
    while (await this.isEntityExists(newPath)) {
      newName = `${baseName} copy ${counter}${ext}`;
      newPath = nodePath.join(dir, newName);
      counter++;
    }

    return newName;
  }

  protected isDangerousPath(path: string) {
    return /(\.\.\/|\.\/|^\/$)/.test(path);
  }

  /**
   * Escapes a path, but throws errors if invalid.
   * Use when you want strict validation.
   */
  protected escapePath(path: string, throwError: boolean = false): string {
    if (typeof path !== "string" || path.trim() === "") {
      return this.basePath;
    }

    // Check for directory traversal attempts
    if (this.isDangerousPath(path)) {
      if (throwError) throw new Error("Invalid path: Path cannot contain '../' or './'.");
      return this.basePath;
    }

    if (!path.startsWith(this.basePath)) {
      if (throwError) throw new Error(`Invalid path: Path must start with "${this.basePath}".`);
      return this.basePath;
    }

    return path;
  }

  /**
   * Returns a fully resolved and validated normalized path.
   */
  protected normalizePath(path: string, throwError: boolean = true): string {
    return nodePath.join(this.coreFolder, this.escapePath(path, throwError));
  }

  /**
   * Recursively collects files/folders for a directory path.
   * Optimized for performance with parallel processing and reduced I/O operations.
   */
  protected async directoryTree(
    path: string,
    options: DirectoryTreeOptions,
    onEachFile?: (item: FSItem, path: typeof nodePath, stats: fs.Stats) => void,
    onEachDirectory?: (item: FSItem, path: typeof nodePath, stats: fs.Stats) => void,
    isRecursiveCall: boolean = false,
    currentDepth: number = 0
  ): Promise<FSItem | null> {
    // Only normalize on the first call, not in recursive calls
    const fullPath = isRecursiveCall ? path : this.normalizePath(path, true);
    try {
      // Get item info asynchronously
      const item = await this.getItemInfoAsync(fullPath, options);

      // Apply exclusions early
      if (options?.exclude) {
        const excludes = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
        if (excludes.some((exclusion) => exclusion.test(fullPath))) {
          return null;
        }
      }

      // Handle files
      if (item.type === ENTITY_CONST.FILE) {
        if (!options.includeFiles) return null;

        const ext = nodePath.extname(fullPath).toLowerCase();
        if (options.extensions && !options.extensions.test(ext)) return null;

        if (onEachFile) {
          const stats = await fsPromises.stat(fullPath);
          onEachFile(item, nodePath, stats);
        }

        return item;
      }

      // Handle directories
      if (item.type === ENTITY_CONST.DIRECTORY) {
        // Check if we should fetch children
        const skipChildren =
          options.withChildren === false ||
          (options.childrenDepth !== undefined && currentDepth >= options.childrenDepth);

        if (skipChildren) {
          return item;
        }

        const dirData = await this.safeReadDirAsync(fullPath);
        if (dirData === null) return null;

        // Process children in parallel with concurrency limit
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
          const stats = await fsPromises.stat(fullPath);
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

    for (const item of items) {
      const fullPath = nodePath.join(dir, item);
      let treeItem: FSItem;

      try {
        treeItem = await this.getItemInfoAsync(fullPath, options);
      } catch (e: any) {
        console.error(`Error getting stats for ${fullPath}: ${e.message}`);
        continue;
      }

      if (nodePath.basename(fullPath).toLowerCase().includes(searchString.toLowerCase())) {
        results.push(treeItem);
      }

      if (treeItem.type === ENTITY_CONST.DIRECTORY) {
        const subItems = await this.searchDirectoryTree(fullPath, searchString, options);
        results.push(...subItems);
      }
    }

    return results;
  }

  /**
   * Process children in batches to avoid overwhelming the system with concurrent operations
   */
  private async processChildrenInBatches(
    paths: string[],
    options: DirectoryTreeOptions,
    onEachFile?: (item: FSItem, path: typeof nodePath, stats: fs.Stats) => void,
    onEachDirectory?: (item: FSItem, path: typeof nodePath, stats: fs.Stats) => void,
    currentDepth: number = 0,
    batchSize: number = 50
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
   * Async version of getItemInfo for better performance
   */
  protected async getItemInfoAsync(fullPath: string, options: DirectoryTreeOptions): Promise<FSItem> {
    const stats = await fsPromises.stat(fullPath);
    //TODO: Add support for symlinks
    // const stats = await fsPromises.lstat(fullPath);
    // if (stats.isSymbolicLink()) {
    // }
    const name = nodePath.basename(fullPath);
    const isDirectory = stats.isDirectory();
    const type: EntityType = isDirectory ? ENTITY_CONST.DIRECTORY : ENTITY_CONST.FILE;

    // Optimize path trimming
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

  /**
   * Optimized path computation
   */
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
   * Sync version kept for backwards compatibility
   */
  protected getItemInfo(fullPath: string, options: DirectoryTreeOptions): FSItem {
    const stats = fs.statSync(fullPath);
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

  /**
   * Convert permission mode to human-readable strings
   * Optimized with bitwise operations
   */
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

  /**
   * Async version of safe read directory
   */
  protected async safeReadDirAsync(path: string): Promise<string[] | null> {
    try {
      return await fsPromises.readdir(path);
    } catch (ex: any) {
      if (ex.code === "EACCES" || ex.code === "EPERM") {
        // User does not have permissions, ignore directory
        return null;
      }
      throw ex;
    }
  }

  /**
   * Safe read directory sync (kept for backwards compatibility)
   */
  protected safeReadDirSync(path: string): string[] | null {
    try {
      return fs.readdirSync(path);
    } catch (ex: any) {
      if (ex.code === "EACCES" || ex.code === "EPERM") {
        return null;
      }
      throw ex;
    }
  }

  protected async isEntityExists(path: string): Promise<boolean> {
    try {
      await fsPromises.access(path, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}

export default LocalFileManagerSDK;
