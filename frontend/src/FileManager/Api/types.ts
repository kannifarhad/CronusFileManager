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
  type: "cut" | "copy";
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
