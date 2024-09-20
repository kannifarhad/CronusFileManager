/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CopyObjectCommand,
  DeleteObjectsCommand,
  S3ClientConfig,
  GetObjectCommandInput,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Define the type for file and directory listings
interface S3File {
  Key: string;
}

interface S3Directory {
  Prefix: string;
}

// Define configurations and common properties
const REGION = "your-region"; // Change based on your region
const BUCKET_NAME = "your-bucket-name";
const ENDPOINT = "https://your-custom-endpoint.com"; // e.g., DigitalOcean, Hetzner
const ACCESS_KEY_ID = "your-access-key";
const SECRET_ACCESS_KEY = "your-secret-key";

// Initialize the S3 Client
const s3Config: S3ClientConfig = {
  region: REGION,
  endpoint: ENDPOINT, // Use custom endpoint for S3-compatible services
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
};

const s3Client = new S3Client(s3Config);

// Upload File to S3 Bucket
export const uploadFile = async (file: File, key: string): Promise<void> => {
  try {
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    console.log(`File uploaded successfully: ${key}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

// Download File from S3 Bucket
export const downloadFile = async (key: string): Promise<void> => {
  try {
    const getParams: GetObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(getParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

// List Files in S3 Bucket
export const listFiles = async (prefix = ""): Promise<S3File[]> => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);
    return response.Contents  as S3File[] || [] ;
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
};

// List Directories in S3 Bucket
export const listDirectories = async (prefix = ""): Promise<S3Directory[]> => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      Delimiter: "/",
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);
    return (
      response?.CommonPrefixes?.map((dir) => ({ Prefix: dir.Prefix }))  || []
    ) as S3Directory[];
  } catch (error) {
    console.error("Error listing directories:", error);
    return [];
  }
};

// Create a Directory in S3 Bucket (empty object with a trailing '/')
export const createDirectory = async (dirName: string): Promise<void> => {
  try {
    if (!dirName.endsWith("/")) dirName += "/";

    const params = {
      Bucket: BUCKET_NAME,
      Key: dirName,
      Body: "",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log(`Directory created successfully: ${dirName}`);
  } catch (error) {
    console.error("Error creating directory:", error);
  }
};

// Delete a File in S3 Bucket
export const deleteFile = async (key: string): Promise<void> => {
  try {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
    console.log(`File deleted successfully: ${key}`);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

// Delete a Directory in S3 Bucket (delete all objects under the directory prefix)
export const deleteDirectory = async (dirName: string): Promise<void> => {
  try {
    if (!dirName.endsWith("/")) dirName += "/";

    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: dirName,
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(listCommand);

    if (response.Contents?.length === 0) {
      console.log(`No objects found in directory: ${dirName}`);
      return;
    }

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: response?.Contents?.map((item) => ({ Key: item.Key })),
      },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3Client.send(deleteCommand);

    console.log(`Directory deleted successfully: ${dirName}`);
  } catch (error) {
    console.error("Error deleting directory:", error);
  }
};

// Copy a File or Directory in S3 Bucket
export const copyObject = async (
  sourceKey: string,
  destinationKey: string
): Promise<void> => {
  try {
    const copyParams = {
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    };

    const command = new CopyObjectCommand(copyParams);
    await s3Client.send(command);
    console.log(
      `Object copied successfully from ${sourceKey} to ${destinationKey}`
    );
  } catch (error) {
    console.error("Error copying object:", error);
  }
};

// Move a File in S3 Bucket (copy then delete)
export const moveFile = async (
  sourceKey: string,
  destinationKey: string
): Promise<void> => {
  try {
    await copyObject(sourceKey, destinationKey);
    await deleteFile(sourceKey);
    console.log(`File moved from ${sourceKey} to ${destinationKey}`);
  } catch (error) {
    console.error("Error moving file:", error);
  }
};

// Move a Directory in S3 Bucket (copy then delete all)
export const moveDirectory = async (
  sourceDir: string,
  destinationDir: string
): Promise<void> => {
  try {
    if (!sourceDir.endsWith("/")) sourceDir += "/";
    if (!destinationDir.endsWith("/")) destinationDir += "/";

    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: sourceDir,
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(listCommand);

    for (let object of response.Contents || []) {
      const destinationKey = object?.Key?.replace(sourceDir, destinationDir);
      if (object.Key && destinationKey) {
        await copyObject(object.Key, destinationKey);
      }
    }

    await deleteDirectory(sourceDir);
    console.log(`Directory moved from ${sourceDir} to ${destinationDir}`);
  } catch (error) {
    console.error("Error moving directory:", error);
  }
};

// Rename a File in S3 Bucket (copy to new key and delete old one)
export const renameFile = async (
  oldKey: string,
  newKey: string
): Promise<void> => {
  try {
    await copyObject(oldKey, newKey); // Copy file to new key
    await deleteFile(oldKey); // Delete old file
    console.log(`File renamed from ${oldKey} to ${newKey}`);
  } catch (error) {
    console.error("Error renaming file:", error);
  }
};

// Rename a Directory in S3 Bucket (copy to new directory and delete old one)
export const renameDirectory = async (
  oldDir: string,
  newDir: string
): Promise<void> => {
  try {
    if (!oldDir.endsWith("/")) oldDir += "/";
    if (!newDir.endsWith("/")) newDir += "/";

    // List all objects within the old directory
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: oldDir,
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(listCommand);

    // Copy each file from old directory to new directory
    // for (let object of response.Contents || []) {
    //   const newKey = object.Key.replace(oldDir, newDir);
    //   await copyObject(object.Key, newKey);
    // }

    // Delete the old directory and its contents
    await deleteDirectory(oldDir);

    console.log(`Directory renamed from ${oldDir} to ${newDir}`);
  } catch (error) {
    console.error("Error renaming directory:", error);
  }
};
