/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import express, { Router } from "express";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import catchAsync from "../utilits/catchAsync";
import { s3config, bucketName, MAX_UPLOAD_FILE_AMOUNT, MAX_UPLOAD_FILE_SIZE } from "../config";
import { bucketManagerController } from "../controllers";

const router: Router = express.Router();

// Initialize S3 client and controller
const s3Client = new S3Client(s3config);
const s3Controller = new bucketManagerController(s3Client, bucketName);

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_UPLOAD_FILE_AMOUNT,
    fileSize: MAX_UPLOAD_FILE_SIZE,
  },
});

// Routes
router.get("/foldertree", catchAsync(s3Controller.folderTree.bind(s3Controller)));
router.post("/folder", catchAsync(s3Controller.folderInfo.bind(s3Controller)));
router.post("/rename", catchAsync(s3Controller.rename.bind(s3Controller)));
router.post("/createfile", catchAsync(s3Controller.createFile.bind(s3Controller)));
router.post("/createfolder", catchAsync(s3Controller.createFolder.bind(s3Controller)));
router.post("/delete", catchAsync(s3Controller.delete.bind(s3Controller)));
router.post("/copy", catchAsync(s3Controller.copy.bind(s3Controller)));
router.post("/move", catchAsync(s3Controller.move.bind(s3Controller)));
router.post("/duplicate", catchAsync(s3Controller.duplicateFile.bind(s3Controller)));
router.post("/emptydir", catchAsync(s3Controller.emptydir.bind(s3Controller)));
router.post("/unzip", catchAsync(s3Controller.unzipFile.bind(s3Controller)));
router.post("/archive", catchAsync(s3Controller.archive.bind(s3Controller)));
router.get("/thumb/*", catchAsync(s3Controller.getThumb.bind(s3Controller)));
router.post("/getlink", catchAsync(s3Controller.getLink.bind(s3Controller)));
router.post("/search", catchAsync(s3Controller.search.bind(s3Controller)));
router.post("/saveimage", catchAsync(s3Controller.saveImage.bind(s3Controller)));
// router.post('/upload', upload.any(), catchAsync(s3Controller.uploadFiles.bind(s3Controller)));

export default router;
