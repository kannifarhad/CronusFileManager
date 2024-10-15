const config = {
  region: "us-east-1",
  endpoint: "http://192.168.1.6:9001",
  bucket: "cronusfilemanager",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
};

module.exports = { config };
