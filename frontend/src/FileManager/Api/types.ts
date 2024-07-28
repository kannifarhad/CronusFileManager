import { FolderList, ItemsList } from "../types";

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

export interface ArchiveParams {
  files: string[];
  destination: string;
  name: string;
}

export interface SaveImageParams {
  file: string;
  path: string;
  isnew: boolean;
}

export interface GetFoldersListResponse extends FolderList {
}

export interface GetFilesListResponse extends ItemsList {
}
export interface Premissions {
  others: string
  group: string
  owner: string
}

export interface Children {
  path: string
  name: string
  created: string
  modified: string
  type: string
  id: string
  premissions: Premissions
  size?: number
  extension?: string
}
