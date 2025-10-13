/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import express, { Router } from "express";
import multer from "multer";
import catchAsync from "../utilits/catchAsync";
import _fileManagerController from "../controllers/fileManagerController";
import { FILE_STORAGE_TMP_FOLDER } from "../config/fileStorage";
import { MAX_UPLOAD_FILE_AMOUNT, MAX_UPLOAD_FILE_SIZE } from "../config/common";
import AppError from "../utilits/appError";
import LocalFileManagerSDK from "../sdk/LocalFileManagerSDK";

const router: Router = express.Router();

// Configure multer
const upload = multer({
  dest: FILE_STORAGE_TMP_FOLDER,
  limits: {
    files: MAX_UPLOAD_FILE_AMOUNT,
    fieldSize: MAX_UPLOAD_FILE_SIZE,
  },
  // @ts-expect-error: multer typings do not include onError, handled in controller
  onError: function (err: Error, next: (err?: Error) => void) {
    return next(new AppError(`Error while uploading: ${err?.message}`, 400));
  },
});

const localFileMangerService = new LocalFileManagerSDK({
  tempFolder: "tmp",
  rootFolder: "uploads",
});

const fileManagerController = new _fileManagerController(localFileMangerService);

// Routes
router.get("/foldertree", catchAsync(fileManagerController.folderTree));
router.post("/folder", catchAsync(fileManagerController.folderInfo));
router.post("/all", catchAsync(fileManagerController.all));
router.post("/rename", catchAsync(fileManagerController.rename));
router.post("/createfile", catchAsync(fileManagerController.createFile));
router.post("/createfolder", catchAsync(fileManagerController.createFolder));
router.post("/delete", catchAsync(fileManagerController.delete));
router.post("/copy", catchAsync(fileManagerController.copy));
router.post("/move", catchAsync(fileManagerController.move));
router.post("/emptydir", catchAsync(fileManagerController.emptyDir));
router.post("/unzip", catchAsync(fileManagerController.unzip));
router.post("/archive", catchAsync(fileManagerController.archive));
router.post("/duplicate", catchAsync(fileManagerController.duplicate));
router.post("/saveimage", catchAsync(fileManagerController.saveImage));
router.post("/search", catchAsync(fileManagerController.search));
// router.post("/upload", upload.any(), catchAsync(fileManagerController.uploadFiles));

export default router;
