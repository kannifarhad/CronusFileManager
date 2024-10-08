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
const s3Controller = new bucketManagerController(s3Client);

// configure multer
// const upload = multer({
//   dest: `${TMP_PATH}/`,
//   limits: {
//     files: 15, // allow up to 5 files per request,
//     fieldSize: 5 * 1024 * 1024, // 2 MB (max file size)
//   },
// });

router.get("/foldertree", s3Controller.folderTree.bind(s3Controller));
router.post("/folder", s3Controller.folderInfo.bind(s3Controller));
// router.post("/all", bucketManagerController.all);
// router.post("/rename", bucketManagerController.rename);
// router.post("/createfile", bucketManagerController.createfile);
// router.post("/createfolder", bucketManagerController.createfolder);
// router.post("/delete", bucketManagerController.delete);
// router.post("/copy", bucketManagerController.copy);
// router.post("/move", bucketManagerController.move);
// router.post("/emptydir", bucketManagerController.emptydir);
// router.post("/unzip", bucketManagerController.unzip);
// router.post("/archive", bucketManagerController.archive);
// router.post("/duplicate", bucketManagerController.duplicate);
// router.post("/saveimage", bucketManagerController.saveImage);
// router.post("/upload", upload.any(), bucketManagerController.uploadFiles);

module.exports = router;
