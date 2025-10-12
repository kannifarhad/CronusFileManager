const config = {
  region: "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  bucket: "cronusfilemanager",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
};

module.exports = { config };
