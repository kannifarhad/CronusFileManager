import axios, { AxiosInstance } from "axios";
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
  IServerConnection,
  SearchParams,
} from "./types";

class Ec2ServerConnection extends IServerConnection {
  private axiosInstance: AxiosInstance;

  private baseURL: string;

  constructor(baseURL: string) {
    super();
    if (!baseURL) {
      throw new Error("Base URL is not defined.");
    }
    this.baseURL = baseURL;

    this.axiosInstance = axios.create({
      baseURL: `${baseURL}/fm`,
      timeout: 2000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add interceptors if needed
    this.axiosInstance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    this.copyFilesToFolder = this.copyFilesToFolder.bind(this);
    this.cutFilesToFolder = this.cutFilesToFolder.bind(this);
  }

  async getFolderTree(): Promise<GetFoldersListResponse> {
    return this.axiosInstance
      .get("foldertree")
      .then((response) => response.data);
  }

  async getFilesList({ path }: PathParam): Promise<GetFilesListResponse> {
    return this.axiosInstance
      .post("folder", { path })
      .then((response) => response.data?.children);
  }

  getThumb(filePath: string): string {
    return `${this.baseURL}${filePath}`;
  }

  async downloadFile({ path }: PathParam) {
    setTimeout(() => {
      window.open(`${this.baseURL}${path}`);
    }, 100);
  }

  async copyFilesToFolder({
    items,
    destination,
  }: PasteFilesParams): Promise<any> {
    return this.axiosInstance
      .post("copy", { items, destination })
      .then((response) => response.data);
  }

  async search({ path, text }: SearchParams): Promise<any> {
    return this.axiosInstance
      .post("search", { path, text })
      .then((response) => response.data);
  }

  async cutFilesToFolder({
    items,
    destination,
  }: PasteFilesParams): Promise<any> {
    return this.axiosInstance
      .post("move", { items, destination })
      .then((response) => response.data);
  }

  async deleteItems({ items }: DeleteItemsParams): Promise<any> {
    return this.axiosInstance
      .post("delete", { items })
      .then((response) => response?.data);
  }

  async emptyDir({ path }: PathParam): Promise<any> {
    return this.axiosInstance
      .post("emptydir", { path })
      .then((response) => response.data);
  }

  async createNewFile({ path, file }: CreateNewFileParams): Promise<any> {
    return this.axiosInstance
      .post("createfile", { path, file })
      .then((response) => response.data);
  }

  async createNewFolder({ path, folder }: CreateNewFolderParams): Promise<any> {
    return this.axiosInstance
      .post("createfolder", { path, folder })
      .then((response) => response.data);
  }

  async renameFiles({ path, newname }: RenameFilesParams): Promise<any> {
    return this.axiosInstance
      .post("rename", { path, newname })
      .then((response) => response.data);
  }

  async duplicateItem({ path }: PathParam): Promise<any> {
    return this.axiosInstance
      .post("duplicate", { path })
      .then((response) => response.data);
  }

  async unzip({ file, destination }: UnzipParams): Promise<any> {
    return this.axiosInstance
      .post("unzip", { file, destination })
      .then((response) => response.data);
  }

  async archive({ files, destination, name }: ArchiveParams): Promise<any> {
    return this.axiosInstance
      .post("archive", { files, destination, name })
      .then((response) => response.data);
  }

  async saveFile({ file, selectedFile, isnew }: SaveFileParams): Promise<any> {
    return this.axiosInstance
      .post("saveimage", { file, path: selectedFile.path, isnew })
      .then((response) => response.data);
  }

  async uploadFile(body: any): Promise<any> {
    return this.axiosInstance
      .post("upload", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  }
}

export default Ec2ServerConnection;
