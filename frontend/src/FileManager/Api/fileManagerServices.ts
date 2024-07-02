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
  SaveImageParams,
} from "./types";

const axiosInstance = createAxiosInstance();

export const getFoldersList = async ({
  path,
}: {
  path: string;
}): Promise<any> => {
  return axiosInstance
    .post("folder", { path })
    .then((response) => response.data);
};

export const getFolderTree = async (): Promise<any> => {
  return axiosInstance.post("/fm/foldertree").then((response) => response.data);
};

export const getFilesList = async ({ path }: PathParam): Promise<any> => {
  return axiosInstance
    .post("/fm/folder", { path })
    .then((response) => response.data);
};

export const renameFiles = async ({
  path,
  newname,
}: RenameFilesParams): Promise<any> => {
  return axiosInstance
    .post("/fm/rename", { path, newname })
    .then((response) => response.data);
};

export const createNewFile = async ({
  path,
  file,
}: CreateNewFileParams): Promise<any> => {
  return axiosInstance
    .post("/fm/createfile", { path, file })
    .then((response) => response.data);
};

export const createNewFolder = async ({
  path,
  folder,
}: CreateNewFolderParams): Promise<any> => {
  return axiosInstance
    .post("/fm/createfolder", { path, folder })
    .then((response) => response.data);
};

export const copyFilesToFolder = async ({
  items,
  type,
  destination,
}: PasteFilesParams): Promise<any> => {
  const url = "/fm/copy";
  return axiosInstance
    .post(url, { items, destination })
    .then((response) => response.data);
};

export const cutFilesToFolder = async ({
  items,
  type,
  destination,
}: PasteFilesParams): Promise<any> => {
  const url = "/fm/move";
  return axiosInstance
    .post(url, { items, destination })
    .then((response) => response.data);
};

export const emptydir = async ({ path }: PathParam): Promise<any> => {
  return axiosInstance
    .post("/fm/emptydir", { path })
    .then((response) => response.data);
};

export const deleteItems = async ({
  items,
}: DeleteItemsParams): Promise<any> => {
  return axiosInstance
    .post("/fm/delete", { items })
    .then((response) => response.data);
};

export const duplicateItem = async ({ path }: PathParam): Promise<any> => {
  return axiosInstance
    .post("/fm/duplicate", { path })
    .then((response) => response.data);
};

export const unzip = async ({
  file,
  destination,
}: UnzipParams): Promise<any> => {
  return axiosInstance
    .post("/fm/unzip", { file, destination })
    .then((response) => response.data);
};

export const archive = async ({
  files,
  destination,
  name,
}: ArchiveParams): Promise<any> => {
  return axiosInstance
    .post("/fm/archive", { files, destination, name })
    .then((response) => response.data);
};

export const saveimage = async ({
  file,
  path,
  isnew,
}: SaveImageParams): Promise<any> => {
  return axiosInstance
    .post("/fm/saveimage", { file, path, isnew })
    .then((response) => response.data);
};

export const uploadFile = async (body: any): Promise<any> => {
  return axiosInstance
    .post("/fm/upload", body)
    .then((response) => response.data);
};
