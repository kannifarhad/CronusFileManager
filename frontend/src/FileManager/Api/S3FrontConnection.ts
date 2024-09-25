import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CommonPrefix,
  _Object as ContentsType,
} from "@aws-sdk/client-s3";
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
} from "./types";
import { FolderList, ItemType, S3BucketInstance, FileType } from "../types";

const convertCommonPrefixes = (
  commonPrefixes?: CommonPrefix[]
): FolderList[] => {
  return (
    commonPrefixes?.map((dir) => ({
      path: dir.Prefix!,
      name: (dir.Prefix!.match(/([^/]+)\/$/) || [])[1],
      created: "",
      modified: "",
      id: dir.Prefix! + Date.now(),
      type: ItemType.FOLDER,
      children: [],
      size: 0,
      private: false,
    })) || []
  );
};

const convertContents = (contents?: ContentsType[]): FileType[] => {
  return (
    contents?.map((file) => {
      const path = file.Key!;
      const match = path.match(/([^/]+)\.([^./]+)$/);
      const fileNameWithExt = match?.[0];
      const extension = `.${match![2]}` as FileType["extension"];
      return {
        path,
        name: fileNameWithExt!,
        created: String(file.LastModified || ""),
        modified: String(file.LastModified || ""),
        id: file.ETag || path + Date.now(),
        type: ItemType.FILE,
        size: file.Size || 0,
        private: false,
        extension,
      };
    }) || []
  );
};

// Extend the class to handle S3 operations
class S3Connection extends IServerConnection {
  private s3Client: S3Client;

  private bucketName: string;

  constructor(config: S3BucketInstance) {
    super(); // Call the abstract class constructor
    if (!config.bucket) {
      throw new Error("S3 Bucket name is not defined.");
    }

    this.bucketName = config.bucket;
    this.s3Client = new S3Client(config);
  }

  async getFolderTree(prefix = ""): Promise<GetFoldersListResponse> {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix,
      Delimiter: "/",
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);
    return {
      path: "/",
      name: "root",
      created: "null",
      id: String(Date.now()),
      modified: "null",
      type: ItemType.FOLDER,
      size: 0,
      children: convertCommonPrefixes(response?.CommonPrefixes),
    };
  }

  // Method to list files in a folder (S3 "folder" is just a prefix)
  async getFilesList({ path }: PathParam): Promise<GetFilesListResponse> {
    const command = new ListObjectsCommand({
      Bucket: this.bucketName,
      Prefix: path === "/" ? "" : path, // Empty string for root
      Delimiter: "/", // To emulate folder structure
    });

    const response = await this.s3Client.send(command);
    const result = [
      ...convertCommonPrefixes(response?.CommonPrefixes),
      ...convertContents(response?.Contents),
    ];
    return result;
  }

  // Method to copy files within S3
  async copyFilesToFolder({
    items,
    destination,
  }: PasteFilesParams): Promise<any> {
    const copyPromises = items.map((item) =>
      this.s3Client.send(
        new CopyObjectCommand({
          Bucket: this.bucketName,
          Key: `${destination}/${item}`,
          CopySource: `${this.bucketName}/${item}`,
        })
      )
    );
    return Promise.all(copyPromises);
  }

  // Method to move (cut) files within S3 (copy + delete)
  async cutFilesToFolder({
    items,
    destination,
  }: PasteFilesParams): Promise<any> {
    await this.copyFilesToFolder({ items, destination });
    return this.deleteItems({ items });
  }

  // Method to delete objects from S3
  async deleteItems({ items }: DeleteItemsParams): Promise<any> {
    const deletePromises = items.map((item) =>
      this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.bucketName, Key: item })
      )
    );
    return Promise.all(deletePromises);
  }

  // Method to create a new folder (S3 doesn't have real folders, so create an empty object with a trailing slash)
  async createNewFolder({ path, folder }: CreateNewFolderParams): Promise<any> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${path}/${folder}/`, // Create "folder" with a trailing slash
    });
    return this.s3Client.send(command);
  }

  // Method to create a new file in S3
  async createNewFile({ path, file }: CreateNewFileParams): Promise<any> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: file,
    });
    return this.s3Client.send(command);
  }

  // Method to rename a file (S3 doesn't support renaming, so it's a copy + delete operation)
  async renameFiles({ path, newname }: RenameFilesParams): Promise<any> {
    await this.copyFilesToFolder({ items: [path], destination: newname });
    return this.deleteItems({ items: [path] });
  }

  // Method to save a file in S3
  async saveFile({ file, path, isnew }: SaveFileParams): Promise<any> {
    return this.createNewFile({ path, file });
  }

  // Method to upload files to S3
  async uploadFile(body: any): Promise<any> {
    const { file, path } = body; // Extract file and path from body
    return this.createNewFile({ path, file });
  }

  // Method to unzip a file (you'd likely need a third-party library to handle actual unzipping)
  async unzip({ file, destination }: UnzipParams): Promise<any> {
    // Logic to unzip the file using a library and re-upload extracted files to S3
    throw new Error(
      `Archiving files is not supported directly by S3. ${this.bucketName}`
    );
  }

  // Method to archive files (you'd likely need to handle zipping and uploading)
  async archive({ files, destination, name }: ArchiveParams): Promise<any> {
    // Logic to zip files and upload the archive
    throw new Error(
      `Archiving files is not supported directly by S3. ${this.bucketName}`
    );
  }

  async emptyDir({ path }: PathParam): Promise<any> {
    throw new Error(
      `Archiving files is not supported directly by S3. ${this.bucketName}`
    );
  }

  async duplicateItem({ path }: PathParam): Promise<any> {
    throw new Error(
      `Archiving files is not supported directly by S3. ${this.bucketName}`
    );
  }
}

export default S3Connection;
