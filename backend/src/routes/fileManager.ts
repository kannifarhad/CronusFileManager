/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import express, { Request, Response, NextFunction, Router } from "express";
import multer from "multer";
import fsExtra from "fs-extra";
import catchAsync from "../utilits/catchAsync";
import _fileManagerController from "../controllers/fileManagerController";
import {
  ALLOWED_FILE_EXTENSIONS,
  FILE_STORAGE_MAIN_FOLDER,
  FILE_STORAGE_TMP_FOLDER,
  MAX_UPLOAD_FILE_AMOUNT,
  MAX_UPLOAD_FILE_SIZE,
} from "../config";
import AppError from "../utilits/appError";
import LocalFileManagerSDK from "../sdk/LocalFileManagerSDK";

const router: Router = express.Router();

const safeStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Ensure directory exists before multer writes to it
      await fsExtra.ensureDir(FILE_STORAGE_TMP_FOLDER);
      cb(null, FILE_STORAGE_TMP_FOLDER);
    } catch (error) {
      cb(error as Error, FILE_STORAGE_TMP_FOLDER);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Configure multer
const upload = multer({
  storage: safeStorage, // Use custom storage instead of dest
  limits: {
    files: MAX_UPLOAD_FILE_AMOUNT,
    fieldSize: MAX_UPLOAD_FILE_SIZE,
  },
  // @ts-expect-error: multer typings do not include onError, handled in controller
  onError: function (err: Error, next: (err?: Error) => void) {
    return next(new AppError(`Error while uploading: ${err?.message}`, 400));
  },
});

/**
 * Middleware to clean up uploaded files after request completion
 * Should be added AFTER the route handler
 */
const cleanupUploadedFiles = async (req: Request, res: Response, next: NextFunction) => {
  // Store the original res.send and res.json to intercept them
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  // Flag to ensure cleanup happens only once
  let cleanupDone = false;

  const cleanup = async () => {
    if (cleanupDone) return;
    cleanupDone = true;

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) return;

    try {
      await Promise.all(
        files.map(async (file) => {
          try {
            await fsExtra.remove(file.path);
            console.log(`Cleaned up temp file: ${file.path}`);
          } catch (err) {
            console.error(`Failed to cleanup file ${file.path}:`, err);
          }
        })
      );
    } catch (error) {
      console.error("Error during file cleanup:", error);
    }
  };

  // Intercept response methods
  res.send = function (data: any) {
    cleanup().finally(() => originalSend(data));
    return res;
  };

  res.json = function (data: any) {
    cleanup().finally(() => originalJson(data));
    return res;
  };

  // Also cleanup on error
  res.on("finish", cleanup);
  res.on("close", cleanup);

  next();
};

const localFileMangerService = new LocalFileManagerSDK({
  tempFolder: "tmp",
  rootFolder: FILE_STORAGE_MAIN_FOLDER,
  allowedExtensions: ALLOWED_FILE_EXTENSIONS,
});

export const fileManagerController = new _fileManagerController(localFileMangerService);

// Routes
router.get("/foldertree", catchAsync(fileManagerController.folderTree));
router.post("/folder", catchAsync(fileManagerController.folderInfo));
router.post("/search", catchAsync(fileManagerController.search));
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
router.post("/upload", upload.any(), cleanupUploadedFiles, catchAsync(fileManagerController.uploadFiles));

export default router;
