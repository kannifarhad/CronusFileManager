/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import express, { Router } from "express";
import catchAsync from "./middlewares/catchAsync";
import FileManagerController from "../controllers/fileManagerController";
import { FILE_STORAGE_TMP_FOLDER, FILE_MANAGER_FACTORY_CONFIG } from "../config";
import { FileManagerFactory } from "../sdk";
import contextMiddleware from "../sdk/helpers/contextMiddleware";
import cleanupUploadedFiles from "./middlewares/cleanupUploadedFiles";
import { createMulterUploader } from "../utilits/createMulterUploader";

const router: Router = express.Router();
const upload = createMulterUploader(FILE_STORAGE_TMP_FOLDER);
const fileManagerFactory = new FileManagerFactory(FILE_MANAGER_FACTORY_CONFIG);

export const fileManagerController = new FileManagerController(fileManagerFactory);

router.use(contextMiddleware(fileManagerFactory));

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
