/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2024, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/

const express = require("express");
const multer = require("multer");
const router = express.Router();
const catchAsync = require("../utilits/catchAsync");
const { fileManagerController } = require("../controllers");
const { FILE_STORAGE_TMP_FOLDER } = require("../config/fileStorage");

// configure multer
const upload = multer({
  dest: FILE_STORAGE_TMP_FOLDER,
  limits: {
    files: 15, // allow up to 5 files per request,
    fieldSize: 5 * 1024 * 1024, // 2 MB (max file size)
  },
});

router.get("/foldertree", catchAsync(fileManagerController.folderTree));
router.post("/folder", catchAsync(fileManagerController.folderInfo));
router.post("/all", catchAsync(fileManagerController.all));
router.post("/rename", catchAsync(fileManagerController.rename));
router.post("/createfile", catchAsync(fileManagerController.createfile));
router.post("/createfolder", catchAsync(fileManagerController.createfolder));
router.post("/delete", catchAsync(fileManagerController.delete));
router.post("/copy", catchAsync(fileManagerController.copy));
router.post("/move", catchAsync(fileManagerController.move));
router.post("/emptydir", catchAsync(fileManagerController.emptydir));
router.post("/unzip", catchAsync(fileManagerController.unzip));
router.post("/archive", catchAsync(fileManagerController.archive));
router.post("/duplicate", catchAsync(fileManagerController.duplicate));
router.post("/saveimage", catchAsync(fileManagerController.saveImage));
router.post(
  "/upload",
  upload.any(),
  catchAsync(fileManagerController.uploadFiles)
);

module.exports = router;
