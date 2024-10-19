
const nodePath = require("path");
const coreFolder = nodePath.resolve(__dirname + "/../");
const FILE_STORAGE_MAIN_FOLDER = "uploads";
const FILE_STORAGE_TRASH_FOLDER = "trash";
const FILE_STORAGE_TMP_FOLDER = `${coreFolder}/${FILE_STORAGE_MAIN_FOLDER}/tmp/`;

module.exports = {
  FILE_STORAGE_MAIN_FOLDER,
  FILE_STORAGE_TRASH_FOLDER,
  FILE_STORAGE_TMP_FOLDER,
};
