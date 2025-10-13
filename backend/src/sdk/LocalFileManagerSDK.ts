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

  constructor(config: FileManagerConfig) {
    super(config);
    this.config = config;
    this.coreFolder = process.cwd();
  }

  async getFolderTree({ prefix = "", withChildren = true, includeFiles = false }: FolderTreeOptions) {
    return this.directoryTree(prefix, { withChildren, includeFiles, normalizePath: true, removePath: this.coreFolder });
  }

  async getFolderInfo(path: string) {
    return this.directoryTree(path, { withChildren: false, includeFiles: true, normalizePath: true, removePath: this.coreFolder });
  }

  async getAll(path: string): Promise<FSItem> {
    throw new Error("Method not implemented.");
  }

  async search(params: SearchParams): Promise<FSItem[]> {
    throw new Error("Method not implemented.");
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
    const basePath = `/${this.config.rootFolder}`;

    if (typeof path !== "string" || path.trim() === "") {
      return basePath;
    }

    const invalidPattern = /(\.\.\/|\.\/|^\/$)/;
    if (invalidPattern.test(path)) {
      if (throwError) throw new Error("Invalid path: Path cannot contain '../' or './'.");
      return basePath;
    }

    if (!path.startsWith(basePath)) {
      if (throwError) throw new Error(`Invalid path: Path must start with "${basePath}".`);
      return basePath;
    }

    return path;
  }

  /**
   * Returns a fully resolved and validated normalized path.
   */
  protected normalizePath = (path: string, throwError: boolean = true): string => {
    return nodePath.join(this.coreFolder, this.escapePath(path, throwError));
  };

  /**
   * Recursively collects files/folders for a directory path.
   * Modified to handle already-normalized paths in recursion
   */
  protected directoryTree = async (
    path: string,
    options: DirectoryTreeOptions,
    onEachFile?: (item: FSItem, path: typeof nodePath, stats: fs.Stats) => void,
    onEachDirectory?: (item: FSItem, path: typeof nodePath, stats: fs.Stats) => void,
    isRecursiveCall: boolean = false
  ): Promise<FSItem | null> => {
    let item: FSItem;

    // Only normalize on the first call, not in recursive calls
    const escapePath = isRecursiveCall ? path : this.normalizePath(path, true);

    try {
      item = this.getItemInfo(escapePath, options);
    } catch (e: any) {
      console.error(`Error retrieving info for ${escapePath}: ${e.message}`);
      return null;
    }

    // Exclusions
    if (options?.exclude) {
      const excludes = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
      if (excludes.some((exclusion) => exclusion.test(escapePath))) {
        return null;
      }
    }

    // Handle files
    if (item.type === ENTITY_CONST.FILE && options.includeFiles) {
      const ext = nodePath.extname(escapePath).toLowerCase();

      if (options.extensions && !options.extensions.test(ext)) return null;

      if (options.attributes) {
        options.attributes.forEach((attribute) => {
          item[attribute] = item[attribute] || null;
        });
      }

      if (onEachFile) {
        const stats = fs.statSync(escapePath);
        onEachFile(item, nodePath, stats);
      }

      return item;
    }

    // Handle directories
    if (item.type === ENTITY_CONST.DIRECTORY) {
      const dirData = this.safeReadDirSync(escapePath);
      if (dirData === null) return null;

      if (options.attributes) {
        options.attributes.forEach((attribute) => {
          item[attribute] = item[attribute] || null;
        });
      }

      const children = await Promise.all(
        dirData.map(async (child) =>
          // Pass the full path and set isRecursiveCall to true
          this.directoryTree(
            nodePath.join(escapePath, child),
            options,
            onEachFile,
            onEachDirectory,
            true // Mark as recursive call
          )
        )
      );

      item.children = children.filter((e): e is FSItem => !!e);
      item.size = item.children?.reduce((prev, cur) => prev + (cur.size || 0), 0);

      if (onEachDirectory) {
        const stats = fs.statSync(escapePath);
        onEachDirectory(item, nodePath, stats);
      }

      return item;
    }

    return null;
  };

  protected getItemInfo = (fullPath: string, options: DirectoryTreeOptions): FSItem => {
    try {
      const stats = fs.statSync(fullPath);
      const name = nodePath.basename(fullPath);
      const isDirectory = stats.isDirectory();
      const type: EntityType = isDirectory ? ENTITY_CONST.DIRECTORY : ENTITY_CONST.FILE;
      const trimPath = (path: string): string => {
        return path.replace(/\\/g, "/");
      };
      const itemPath = options?.normalizePath
        ? options.removePath
          ? trimPath(fullPath).replace(trimPath(options.removePath), "")
          : trimPath(fullPath)
        : options?.removePath
        ? fullPath.replace(options.removePath, "")
        : fullPath;

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
    } catch (err) {
      console.error(`Error retrieving info for: ${fullPath}`, err);
      throw err;
    }
  };

  /**
   * Convert permission mode to human-readable strings
   */
  protected permissionsConvert = (mode: number): FSPermissions => {
    return {
      others: (mode & 1 ? "x-" : "") + (mode & 2 ? "w-" : "") + (mode & 4 ? "r" : ""),
      group: (mode & 10 ? "x-" : "") + (mode & 20 ? "w-" : "") + (mode & 40 ? "r" : ""),
      owner: (mode & 100 ? "x-" : "") + (mode & 200 ? "w-" : "") + (mode & 400 ? "r" : ""),
    };
  };

  /**
   * Safe read directory sync
   */
  protected safeReadDirSync = (path: string): string[] | null => {
    try {
      return fs.readdirSync(path);
    } catch (ex: any) {
      if (ex.code === "EACCES" || ex.code === "EPERM") {
        // User does not have permissions, ignore directory
        return null;
      } else throw ex;
    }
  };
}

export default LocalFileManagerSDK;
