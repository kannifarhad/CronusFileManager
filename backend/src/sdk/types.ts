export const ENTITY_CONST = {
  DIRECTORY: "folder",
  FILE: "file",
} as const;

export type EntityType = (typeof ENTITY_CONST)[keyof typeof ENTITY_CONST];

export interface FSItem {
  id: string;
  name: string;
  created: Date;
  modified: Date;
  path: string;
  premissions: FSPermissions;
  type: EntityType;
  size?: number;
  extension?: string;
  children?: FSItem[];
}

export interface DirectoryTreeOptions {
  exclude?: RegExp | RegExp[];
  includeFiles?: boolean;
  extensions?: RegExp;
  normalizePath?: boolean;
  removePath?: string;
  attributes?: string[];
  withChildren?: boolean;
  childrenDepth?: number;
}

export interface FSPermissions {
  owner: string;
  group: string;
  others: string;
}

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

export interface FileManagerSDKBaseConfig {
  allowedExtensions?: string[]; // Allowed file extensions
  maxFileSize?: number; // Max file size in bytes
  rootFolder: string;
}
