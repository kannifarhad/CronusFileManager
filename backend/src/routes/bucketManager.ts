/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import express, { Router } from "express";
import multer from "multer";
import catchAsync from "./middlewares/catchAsync";
import {
  s3config,
  S3_BUCKET_NAME,
  MAX_UPLOAD_FILE_AMOUNT,
  MAX_UPLOAD_FILE_SIZE,
  ALLOWED_FILE_EXTENSIONS,
} from "../config";
import { bucketManagerController } from "../controllers";
import { S3BucketFileManagerSDK } from "../sdk/S3BucketFileManagerSDK";
const router: Router = express.Router();

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_UPLOAD_FILE_AMOUNT,
    fileSize: MAX_UPLOAD_FILE_SIZE,
  },
});

const s3FileMangerService = new S3BucketFileManagerSDK({
  s3config,
  bucketName: S3_BUCKET_NAME,
  rootFolder: "",
  allowedExtensions: ALLOWED_FILE_EXTENSIONS,
  maxFileSize: MAX_UPLOAD_FILE_SIZE,
});

export const fileManagerController = new bucketManagerController(s3FileMangerService);

// Routes
router.get("/foldertree", catchAsync(fileManagerController.folderTree));
router.post("/folder", catchAsync(fileManagerController.folderInfo));
// router.post("/rename", catchAsync(s3Controller.rename.bind(s3Controller)));
// router.post("/createfile", catchAsync(s3Controller.createFile.bind(s3Controller)));
// router.post("/createfolder", catchAsync(s3Controller.createFolder.bind(s3Controller)));
// router.post("/delete", catchAsync(s3Controller.delete.bind(s3Controller)));
// router.post("/copy", catchAsync(s3Controller.copy.bind(s3Controller)));
// router.post("/move", catchAsync(s3Controller.move.bind(s3Controller)));
// router.post("/duplicate", catchAsync(s3Controller.duplicateFile.bind(s3Controller)));
// router.post("/emptydir", catchAsync(s3Controller.emptydir.bind(s3Controller)));
// router.post("/unzip", catchAsync(s3Controller.unzipFile.bind(s3Controller)));
// router.post("/archive", catchAsync(s3Controller.archive.bind(s3Controller)));
// router.get("/thumb/*", catchAsync(s3Controller.getThumb.bind(s3Controller)));
// router.post("/getlink", catchAsync(s3Controller.getLink.bind(s3Controller)));
// router.post("/search", catchAsync(s3Controller.search.bind(s3Controller)));
// router.post("/saveimage", catchAsync(s3Controller.saveImage.bind(s3Controller)));
// router.post('/upload', upload.any(), catchAsync(s3Controller.uploadFiles.bind(s3Controller)));

export default router;
