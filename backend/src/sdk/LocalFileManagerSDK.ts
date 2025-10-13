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

  async rename(params: RenameParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createFile(params: CreateFileParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createFolder(params: CreateFolderParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(params: DeleteParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async copy(params: CopyParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async move(params: MoveParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async duplicate(params: DuplicateParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async emptyDir(params: EmptyDirParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async uploadFiles(params: UploadFilesParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async unzip(params: UnzipParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async archive(params: ArchiveParams): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async getThumb(params: GetThumbParams): Promise<Buffer | NodeJS.ReadableStream> {
    throw new Error("Method not implemented.");
  }

  async getLink(params: GetLinkParams): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async saveImage(params: SaveImageParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getMetadata(path: string): Promise<FSItem> {
    throw new Error("Method not implemented.");
  }

  async exists(path: string): Promise<boolean> {
    throw new Error("Method not implemented.");
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
    if (/(\.\.\/|\.\/|^\/$)/.test(path)) {
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
        const loopChildren =
          options.withChildren === false ||
          (options.childrenDepth !== undefined && currentDepth >= options.childrenDepth);

        if (loopChildren) {
          // Return directory without children
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
          50,
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
    const items = this.safeReadDirSync(dir);
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
    batchSize: number = 50,
    currentDepth: number = 0
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
}

export default LocalFileManagerSDK;
