import type { FILE_EXTENSION_MAP } from "../config";

export enum ItemType {
  FOLDER = "folder",
  FILE = "file",
}

export interface Permissions {
  group: string;
  others: string;
  owner: string;
}

export type Items = FolderType | FileType;
export type ItemsList = Items[];
export interface FolderList extends FolderType {
  children?: FolderList[];
}

export interface FileType {
  path: string;
  name: string;
  created: string;
  modified: string;
  type: ItemType.FILE;
  id: string;
  premissions?: Permissions;
  size: number;
  extension: keyof typeof FILE_EXTENSION_MAP.icons;
  private?: boolean;
}

export interface FolderType {
  path: string;
  name: string;
  created: string;
  id: string;
  modified: string;
  type: ItemType.FOLDER;
  premissions?: Permissions;
  children?: ItemsList | null;
  size: number;
  private?: boolean;
}

export interface PathParam {
  path: string;
}

export interface RenameFilesParams {
  path: string;
  newname: string;
}

export interface CreateNewFileParams {
  path: string;
  file: string;
}

export interface CreateNewFolderParams {
  path: string;
  folder: string;
}

export interface PasteFilesParams {
  items: string[];
  destination: string;
}

export interface DeleteItemsParams {
  items: string[];
}

export interface DuplicateItemParams {
  path: string;
}

export interface UnzipParams {
  file: string;
  destination: string;
}

export interface SearchParams {
  text: string;
  path?: string;
}

export interface ArchiveParams {
  files: string[];
  destination: string;
  name: string;
}

export interface SaveFileParams {
  file: File;
  selectedFile: FileType;
  isnew: boolean;
}

export interface GetFoldersListResponse extends FolderList {}

export interface GetFilesListResponse extends ItemsList {}
export interface Premissions {
  others: string;
  group: string;
  owner: string;
}

export interface Children {
  path: string;
  name: string;
  created: string;
  modified: string;
  type: string;
  id: string;
  premissions: Premissions;
  size?: number;
  extension?: string;
}
