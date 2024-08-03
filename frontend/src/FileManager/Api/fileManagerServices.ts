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
  GetFilesListResponse,
} from "./types";

const axiosInstance = createAxiosInstance();

export const getFolderTree = async (): Promise<GetFoldersListResponse> =>
  axiosInstance.get("foldertree").then((response) => response.data);

export const getFilesList = async ({
  path,
}: PathParam): Promise<GetFilesListResponse> =>
  axiosInstance.post("folder", { path }).then((response) => response.data);

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

export const deleteItems = async ({ items }: DeleteItemsParams): Promise<any> =>
  axiosInstance.post("delete", { items }).then((response) => response?.data);

export const emptydir = async ({ path }: PathParam): Promise<any> =>
  axiosInstance.post("emptydir", { path }).then((response) => response.data);

export const createNewFile = async ({
  path,
  file,
}: CreateNewFileParams): Promise<any> =>
  axiosInstance
    .post("createfile", { path, file })
    .then((response) => response.data);

export const createNewFolder = async ({
  path,
  folder,
}: CreateNewFolderParams): Promise<any> =>
  axiosInstance
    .post("createfolder", { path, folder })
    .then((response) => response.data);

export const renameFiles = async ({
  path,
  newname,
}: RenameFilesParams): Promise<any> =>
  axiosInstance
    .post("rename", { path, newname })
    .then((response) => response.data);

export const duplicateItem = async ({ path }: PathParam): Promise<any> =>
  axiosInstance.post("duplicate", { path }).then((response) => response.data);

export const unzip = async ({ file, destination }: UnzipParams): Promise<any> =>
  axiosInstance
    .post("unzip", { file, destination })
    .then((response) => response.data);

export const archive = async ({
  files,
  destination,
  name,
}: ArchiveParams): Promise<any> =>
  axiosInstance
    .post("archive", { files, destination, name })
    .then((response) => response.data);

export const saveFile = async ({
  file,
  path,
  isnew,
}: SaveFileParams): Promise<any> =>
  axiosInstance
    .post("saveimage", { file, path, isnew })
    .then((response) => response.data);

export const uploadFile = async (body: any): Promise<any> =>
  axiosInstance
    .post("upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
