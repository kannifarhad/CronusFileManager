/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2019, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/

const express = require("express");
const multer = require("multer");
const nodePath = require("path");
const router = express.Router();
const { bucketManagerController } = require("../controllers");
const { S3Client } = require("@aws-sdk/client-s3");

const config = {
  region: "us-east-1",
  endpoint: "http://192.168.1.6:9001",
  bucket: "cronusfilemanager",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
};
const s3Client = new S3Client(config);
const s3Controller = new bucketManagerController(s3Client, config.bucket);

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

router.get("/foldertree", s3Controller.folderTree.bind(s3Controller));
router.post("/folder", s3Controller.folderInfo.bind(s3Controller));
router.post("/rename", s3Controller.rename.bind(s3Controller));
router.post("/createfile", s3Controller.createFile.bind(s3Controller));
router.post("/createfolder", s3Controller.createFolder.bind(s3Controller));
router.post("/delete", s3Controller.delete.bind(s3Controller));
router.post("/copy", s3Controller.copy.bind(s3Controller));
router.post("/move", s3Controller.move.bind(s3Controller));
router.post("/duplicate", s3Controller.duplicateFile.bind(s3Controller));
router.post("/emptydir", s3Controller.emptydir.bind(s3Controller));
router.post("/upload", upload.any(), s3Controller.uploadFiles.bind(s3Controller));
router.post("/unzip", s3Controller.unzipFile.bind(s3Controller));
router.post("/archive", s3Controller.archive.bind(s3Controller));
// router.post("/saveimage", bucketManagerController.saveImage);

module.exports = router;
