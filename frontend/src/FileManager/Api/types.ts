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

export interface SaveFileParams {
  file: File;
  path: string;
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
export abstract class IServerConnection {
  abstract getFolderTree(): Promise<GetFoldersListResponse>;

  abstract getFilesList(params: PathParam): Promise<GetFilesListResponse>;

  abstract copyFilesToFolder(params: PasteFilesParams): Promise<any>;

  abstract cutFilesToFolder(params: PasteFilesParams): Promise<any>;

  abstract deleteItems(params: DeleteItemsParams): Promise<any>;

  abstract emptyDir(params: PathParam): Promise<any>;

  abstract createNewFile(params: CreateNewFileParams): Promise<any>;

  abstract createNewFolder(params: CreateNewFolderParams): Promise<any>;

  abstract renameFiles(params: RenameFilesParams): Promise<any>;

  abstract duplicateItem(params: PathParam): Promise<any>;

  abstract unzip(params: UnzipParams): Promise<any>;

  abstract archive(params: ArchiveParams): Promise<any>;

  abstract saveFile(params: SaveFileParams): Promise<any>;

  abstract uploadFile(body: any): Promise<any>;

  abstract getThumb(filePath: string): string;
}
