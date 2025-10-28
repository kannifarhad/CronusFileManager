import axios, { type AxiosInstance } from "axios";
import type {
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
  SearchParams,
} from "./types";

export interface StandardResponse {
  success: boolean;
  message?: string;
}

export interface DuplicateResponse extends StandardResponse {
  name?: string;
}

export interface ArchiveResponse extends StandardResponse {
  path?: string;
}

export interface GetLinkResponse {
  link: string;
  path?: string;
}

export interface SearchResult {
  path: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  extension?: string;
  created?: string;
  modified?: string;
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

  abstract downloadFile(params: PathParam): void;

  abstract search(params: SearchParams): Promise<any>;

  abstract getThumb(filePath: string): string;
}

export abstract class BaseServerConnection extends IServerConnection {
  protected axiosInstance: AxiosInstance;
  protected baseURL: string;
  protected storageType: "local" | "s3";

  constructor(baseURL: string, storageType: "local" | "s3") {
    super();

    if (!baseURL) {
      throw new Error("Base URL is not defined.");
    }

    this.baseURL = baseURL;
    this.storageType = storageType;

    this.axiosInstance = axios.create({
      baseURL: `${baseURL}/fm`,
      timeout: 1000 * 30,
      headers: {
        "Content-Type": "application/json",
        "x-storage-type": storageType,
      },
    });

    this.setupInterceptors();
    this.bindMethods();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Enhanced error handling
        const message = error.response?.data?.message || error.message;
        return Promise.reject(new Error(message));
      }
    );
  }

  private bindMethods(): void {
    this.copyFilesToFolder = this.copyFilesToFolder.bind(this);
    this.cutFilesToFolder = this.cutFilesToFolder.bind(this);
  }

  // ============================================================================
  // COMMON API METHODS (Same for all storage types)
  // ============================================================================

  async getFolderTree(): Promise<GetFoldersListResponse> {
    const response = await this.axiosInstance.get<GetFoldersListResponse>("foldertree");
    return response.data;
  }

  async getFilesList({ path }: PathParam): Promise<GetFilesListResponse> {
    const response = await this.axiosInstance.post<{ children: GetFilesListResponse }>("folder", { path });
    return response.data?.children || [];
  }

  async search({ path, text }: SearchParams): Promise<SearchResult[]> {
    const response = await this.axiosInstance.post<SearchResult[]>("search", { path, text });
    return response.data;
  }

  async copyFilesToFolder({ items, destination }: PasteFilesParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("copy", { items, destination });
    return response.data;
  }

  async cutFilesToFolder({ items, destination }: PasteFilesParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("move", { items, destination });
    return response.data;
  }

  async deleteItems({ items }: DeleteItemsParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("delete", { items });
    return response.data;
  }

  async emptyDir({ path }: PathParam): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("emptydir", { path });
    return response.data;
  }

  async createNewFile({ path, file }: CreateNewFileParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("createfile", { path, file });
    return response.data;
  }

  async createNewFolder({ path, folder }: CreateNewFolderParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("createfolder", { path, folder });
    return response.data;
  }

  async renameFiles({ path, newname }: RenameFilesParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("rename", { path, newname });
    return response.data;
  }

  async duplicateItem({ path }: PathParam): Promise<DuplicateResponse> {
    const response = await this.axiosInstance.post<DuplicateResponse>("duplicate", { path });
    return response.data;
  }

  async unzip({ file, destination }: UnzipParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("unzip", { file, destination });
    return response.data;
  }

  async archive({ files, destination, name }: ArchiveParams): Promise<ArchiveResponse> {
    const response = await this.axiosInstance.post<ArchiveResponse>("archive", { files, destination, name });
    return response.data;
  }

  async saveFile({ file, selectedFile, isnew }: SaveFileParams): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("saveimage", {
      file,
      path: selectedFile.path,
      isnew,
    });
    return response.data;
  }

  async uploadFile(body: FormData): Promise<StandardResponse> {
    const response = await this.axiosInstance.post<StandardResponse>("upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  abstract getThumb(filePath: string): string;
  abstract downloadFile({ path }: PathParam): Promise<void>;
}
