/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import unzipper from "unzipper";
import archiver from "archiver";
import nodePath from "path";
import fsExtra from "fs-extra";
import FileManagerSDKBase, { FileManagerError } from "./FileManagerSDKBase";

import {
  DirectoryTreeOptions,
  ENTITY_CONST,
  EntityType,
  FSItem,
  FSPermissions,
  SearchParams,
  RenameParams,
  CreateFileParams,
  CreateFolderParams,
  DeleteParams,
  CopyParams,
  MoveParams,
  DuplicateParams,
  EmptyDirParams,
  UploadFilesParams,
  UnzipParams,
  ArchiveParams,
  GetThumbParams,
  GetLinkParams,
  SaveImageParams,
  FileManagerSDKBaseConfig,
} from "./types";
import { sanitizePath } from "./helpers/sanitazePath";
import {
  S3ClientConfig,
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  CommonPrefix,
  _Object,
  CopyObjectCommandOutput,
} from "@aws-sdk/client-s3";

export interface S3FileManagerConfig extends FileManagerSDKBaseConfig {
  s3config: S3ClientConfig;
  bucketName: string;
}

export class S3BucketFileManagerSDK extends FileManagerSDKBase {
  protected bucketName: string;
  protected s3Client: S3Client;

  constructor({ s3config, bucketName, ...config }: S3FileManagerConfig) {
    super(config);
    this.bucketName = bucketName;
    this.s3Client = new S3Client(s3config);
  }

  async getFolderTree({ prefix = "/", withChildren = true, includeFiles = false }) {
    try {
      return await this.directoryTree(prefix);
    } catch (error: any) {
      throw new FileManagerError(`Failed to retrieve folder tree: ${error.message}`, "FOLDER_TREE_ERROR", prefix);
    }
  }

  async getFolderInfo(path: string) {
    console.log("path", path);
    return null;
  }

  async search({ text, path = "" }: SearchParams) {
    return [];
  }

  async rename({ path, newname }: RenameParams) {}
  async delete({ items }: DeleteParams) {}
  async createFile({ path, file }: CreateFileParams) {}
  async createFolder({ path, folder, mask = 0o777 }: CreateFolderParams) {}
  async emptyDir({ path }: EmptyDirParams) {}
  async duplicate({ path }: DuplicateParams) {
    return "";
  }
  async copy({ items, destination }: CopyParams) {}
  async move({ items, destination }: MoveParams) {}
  async unzip({ file, destination = "" }: UnzipParams) {}
  async archive({ files, destination, name }: ArchiveParams) {
    return "";
  }
  async saveImage({ file, isnew, path }: SaveImageParams) {}
  async uploadFiles({ files, fileMaps = [], path }: UploadFilesParams) {}
  async getLink({ path }: GetLinkParams) {
    return "";
  }
  async getThumb(params: GetThumbParams): Promise<Buffer | NodeJS.ReadableStream> {
    throw new Error(" NOT IMPLEMENTED");
  }
  async getMetadata(path: string) {
    return null;
  }
  async exists(path: string) {
    return false;
  }

  private async directoryTree(prefix = ""): Promise<FSItem | null> {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix,
      Delimiter: "/",
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    const folderList = this.convertCommonPrefixes(response.CommonPrefixes);

    for (const folder of folderList) {
      const subFolderTree = await this.directoryTree(folder.path);
      folder.children = subFolderTree?.children || [];
    }

    return {
      path: prefix || "/",
      name: prefix ? (prefix.match(/([^/]+)\/$/) || [])[1] || "root" : "root",
      created: "",
      id: String(Date.now()),
      modified: "",
      type: "folder",
      size: 0,
      children: folderList,
      private: false,
    };
  }

  private convertCommonPrefixes(commonPrefixes: CommonPrefix[] = []): FSItem[] {
    return commonPrefixes.map((dir) => ({
      path: dir.Prefix || "",
      name: (dir.Prefix?.match(/([^/]+)\/$/) || [])[1] || "",
      created: "",
      modified: "",
      id: (dir.Prefix || "") + Date.now(),
      type: "folder",
      children: [],
      size: 0,
      private: false,
    }));
  }
}

export default S3BucketFileManagerSDK;
