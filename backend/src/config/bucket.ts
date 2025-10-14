import { S3ClientConfig } from "@aws-sdk/client-s3";

export const s3config: S3ClientConfig = {
  region: "us-east-1",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
};

export const bucketName = "cronusfilemanager";
