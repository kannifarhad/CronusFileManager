/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import { FSItem } from "./types";

export interface FolderTreeOptions {
  prefix?: string;
  withChildren?: boolean;
  includeFiles?: boolean;
}

export interface RenameParams {
  path: string;
  newname: string;
}

export interface CreateFileParams {
  path: string;
  file: string;
  contentType?: string;
  fileContent?: string | Buffer;
}

export interface CreateFolderParams {
  path: string;
  folder: string;
  mask?: number;
}

export interface DeleteParams {
  items: string[];
}

export interface CopyParams {
  items: string[];
  destination: string;
}

export interface MoveParams {
  items: string[];
  destination: string;
}

export interface DuplicateParams {
  path: string;
}

export interface EmptyDirParams {
  path: string;
}

export interface FileUpload {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
  path: string; // For local file uploads
}

export interface UploadFilesParams {
  path: string;
  files: FileUpload[];
  fileMaps?: Array<{ name: string; path: string }>;
}

export interface UnzipParams {
  file: string;
  destination: string;
}

export interface ArchiveParams {
  files: string[];
  destination: string;
  name: string;
}

export interface GetLinkParams {
  path: string;
  expiresIn?: number; // seconds
}

export interface SaveImageParams {
  path: string;
  file: string; // base64 encoded
  isnew?: boolean;
}

export interface SearchParams {
  text: string;
  path?: string;
}

export interface GetThumbParams {
  path: string;
}

export interface AbstractFileManagerConfig {
  allowedExtensions?: string[]; // Allowed file extensions
  maxFileSize?: number; // Max file size in bytes
  rootFolder: string;
}

const defaultAllowedExtensions = [
  ".jpg",
  ".png",
  ".gif",
  ".jpeg",
  ".svg",
  ".doc",
  ".txt",
  ".csv",
  ".docx",
  ".xls",
  ".xml",
  ".pdf",
  ".zip",
  ".ppt",
  ".mp4",
  ".ai",
  ".psd",
  ".mp3",
  ".avi",
];

export abstract class AbstractFileManager {
  protected config: AbstractFileManagerConfig;

  constructor(config: AbstractFileManagerConfig) {
    this.config = {
      allowedExtensions: config.allowedExtensions || defaultAllowedExtensions,
      maxFileSize: config.maxFileSize || 100 * 1024 * 1024, // 100MB default
      ...config,
    };
  }
  /**
   * Get the complete folder tree structure
   */
  abstract getFolderTree(options?: FolderTreeOptions): Promise<FSItem | null>;

  /**
   * Get folder information (files and subfolders) for a specific path
   */
  abstract getFolderInfo(path: string): Promise<FSItem | null>;

  /**
   * Search for files and folders by name
   */
  abstract search(params: SearchParams): Promise<FSItem[]>;

  /**
   * Rename a file or folder
   */
  abstract rename(params: RenameParams): Promise<void>;

  /**
   * Create a new file
   */
  abstract createFile(params: CreateFileParams): Promise<void>;

  /**
   * Create a new folder
   */
  abstract createFolder(params: CreateFolderParams): Promise<void>;

  /**
   * Delete files or folders
   */
  abstract delete(params: DeleteParams): Promise<void>;

  /**
   * Copy files or folders to a destination
   */
  abstract copy(params: CopyParams): Promise<void>;

  /**
   * Move files or folders to a destination
   */
  abstract move(params: MoveParams): Promise<void>;

  /**
   * Duplicate a file or folder
   */
  abstract duplicate(params: DuplicateParams): Promise<string>;

  /**
   * Empty a directory (remove all contents but keep the directory)
   */
  abstract emptyDir(params: EmptyDirParams): Promise<void>;

  /**
   * Upload multiple files
   */
  abstract uploadFiles(params: UploadFilesParams): Promise<void>;

  /**
   * Extract/unzip an archive file
   */
  abstract unzip(params: UnzipParams): Promise<void>;

  /**
   * Create an archive (zip) from files/folders
   */
  abstract archive(params: ArchiveParams): Promise<string>;

  /**
   * Get a file stream or buffer for thumbnail/preview
   */
  abstract getThumb(params: GetThumbParams): Promise<Buffer | NodeJS.ReadableStream>;

  /**
   * Get a downloadable/shareable link for a file
   */
  abstract getLink(params: GetLinkParams): Promise<string>;

  /**
   * Save an image (typically from base64)
   */
  abstract saveImage(params: SaveImageParams): Promise<void>;

  /**
   * Get file/folder metadata
   */
  abstract getMetadata(path: string): Promise<FSItem>;

  /**
   * Check if file or folder exists
   */
  abstract exists(path: string): Promise<boolean>;

  /**
   * Validates if a given file extension is allowed.
   */
  protected checkExtension(extension: string): boolean {
    if (!extension || !this.config.allowedExtensions) return true;
    return this.config.allowedExtensions.includes(extension.toLowerCase());
  }

  /**
   * Checks that all variables in an array are defined and non-empty.
   */
  protected checkVariables(variables: Array<string | undefined>): boolean {
    return variables.every((element) => element !== "" && element !== undefined);
  }

  /**
   * Escapes a path, but throws errors if invalid.
   * Use when you want strict validation.
   */
  protected escapePath(path: string, throwError: boolean = false): string {
    const basePath = `/${this.config.rootFolder}/`;

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
}

export default AbstractFileManager;
