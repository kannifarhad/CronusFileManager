import nodePath from "path";
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { FileManagerFactoryConfig, StorageProvider } from "../sdk/types";

export const MAX_UPLOAD_FILE_AMOUNT = 50;
export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (max file size)

export const s3config: S3ClientConfig = {
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
};

export const S3_BUCKET_NAME = "cronusfilemanager";

export const FILE_STORAGE_MAIN_FOLDER = "uploads";
export const FILE_STORAGE_TRASH_FOLDER = nodePath.join(FILE_STORAGE_MAIN_FOLDER, "trash");
export const FILE_STORAGE_TMP_FOLDER = nodePath.join(FILE_STORAGE_MAIN_FOLDER, "tmp");
export const PROTECTED_FOLDERS = [FILE_STORAGE_TMP_FOLDER, FILE_STORAGE_TRASH_FOLDER, `${FILE_STORAGE_MAIN_FOLDER}`];

export const ALLOWED_FILE_EXTENSIONS = [
  ".jpg",
  ".png",
  ".gif",
  ".jpeg",
  ".svg",
  ".doc",
  ".txt",
  ".csv",
  ".docx",
  ".xls",
  ".xml",
  ".pdf",
  ".zip",
  ".ppt",
  ".mp4",
  ".ai",
  ".psd",
  ".mp3",
  ".mp4",
  ".avi",
  ".heic",
  ".webm",
];

export const FILE_MANAGER_FACTORY_CONFIG: FileManagerFactoryConfig = {
  providers: {
    [StorageProvider.LOCAL]: {
      rootFolder: FILE_STORAGE_MAIN_FOLDER,
      allowedExtensions: ALLOWED_FILE_EXTENSIONS,
      tempFolder: "tmp",
    },
    [StorageProvider.S3]: {
      rootFolder: FILE_STORAGE_MAIN_FOLDER,
      allowedExtensions: ALLOWED_FILE_EXTENSIONS,
      bucketName: S3_BUCKET_NAME || "",
      s3config,
    },
  },
  defaultProvider: StorageProvider.LOCAL,
};
