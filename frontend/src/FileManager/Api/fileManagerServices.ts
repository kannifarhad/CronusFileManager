import createAxiosInstance from "./axiosInstance";
import {
  PathParam,
  RenameFilesParams,
  CreateNewFileParams,
  CreateNewFolderParams,
  PasteFilesParams,
  DeleteItemsParams,
  UnzipParams,
  ArchiveParams,
  SaveFileParams,
  GetFoldersListResponse,
  GetFilesListResponse
} from "./types";

const axiosInstance = createAxiosInstance();

export const getFolderTree = async (): Promise<GetFoldersListResponse> => {
  return axiosInstance
    .get("foldertree")
    .then((response) => response.data);
};

export const getFilesList = async ({ path }: PathParam): Promise<GetFilesListResponse> => {
  return axiosInstance
    .post("folder", { path })
    .then((response) => response.data);
};

export const copyFilesToFolder = async ({
  items,
  destination,
}: PasteFilesParams): Promise<any> => {
  const url = "copy";
  return axiosInstance
    .post(url, { items, destination })
    .then((response) => response.data);
};

export const cutFilesToFolder = async ({
  items,
  destination,
}: PasteFilesParams): Promise<any> => {
  const url = "move";
  return axiosInstance
    .post(url, { items, destination })
    .then((response) => response.data);
};

export const deleteItems = async ({
  items,
}: DeleteItemsParams): Promise<any> => {
  return axiosInstance
    .post("delete", { items })
    .then((response) => response?.data);
};

export const emptydir = async ({ path }: PathParam): Promise<any> => {
  return axiosInstance
    .post("emptydir", { path })
    .then((response) => response.data);
};

export const createNewFile = async ({
  path,
  file,
}: CreateNewFileParams): Promise<any> => {
  return axiosInstance
    .post("createfile", { path, file })
    .then((response) => response.data);
};

export const createNewFolder = async ({
  path,
  folder,
}: CreateNewFolderParams): Promise<any> => {
  return axiosInstance
    .post("createfolder", { path, folder })
    .then((response) => response.data);
};

export const renameFiles = async ({
  path,
  newname,
}: RenameFilesParams): Promise<any> => {
  return axiosInstance
    .post("rename", { path, newname })
    .then((response) => response.data);
};

export const duplicateItem = async ({ path }: PathParam): Promise<any> => {
  return axiosInstance
    .post("duplicate", { path })
    .then((response) => response.data);
};

export const unzip = async ({
  file,
  destination,
}: UnzipParams): Promise<any> => {
  return axiosInstance
    .post("unzip", { file, destination })
    .then((response) => response.data);
};

export const archive = async ({
  files,
  destination,
  name,
}: ArchiveParams): Promise<any> => {
  return axiosInstance
    .post("archive", { files, destination, name })
    .then((response) => response.data);
};

export const saveFile = async ({
  file,
  path,
  isnew,
}: SaveFileParams): Promise<any> => {
  return axiosInstance
    .post("saveimage", { file, path, isnew })
    .then((response) => response.data);
};

export const uploadFile = async (body: any): Promise<any> => {
  return axiosInstance
    .post("upload", body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
    .then((response) => response.data);
};
