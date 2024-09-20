/* eslint-disable */
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

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

export default s3Client;
