/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2024, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/

const nodePath = require("path");
const coreFolder = nodePath.resolve(__dirname + "/../");
const { FILE_STORAGE_MAIN_FOLDER } = require("../config/fileStorage");

function escapePath(path) {
  const defaultPath = `/${FILE_STORAGE_MAIN_FOLDER}/`;

  // Check if the path is a non-empty string
  if (typeof path !== "string" || path.trim() === "") {
    return defaultPath;
  }

  // Use a regular expression to check for invalid patterns (e.g., "..", "./")
  const invalidPattern = /(\.\.\/|\.\/|^\/$)/;
  if (invalidPattern.test(path)) {
    return defaultPath;
  }

  // Ensure path doesn't start with "dangerous" patterns like `../` or `./`
  if (path.startsWith("/") || path.endsWith("/")) {
    return defaultPath;
  }

  // If everything is valid, return the sanitized path
  return path;
}

function escapePathWithErrors(path) {
  const basePath = `/${FILE_STORAGE_MAIN_FOLDER}/`;

  // Check if the path is a non-empty string
  if (typeof path !== "string" || path.trim() === "") {
    return basePath;
  }

  // Use a regular expression to check for invalid patterns (e.g., "..", "./")
  const invalidPattern = /(\.\.\/|\.\/|^\/$)/;
  if (invalidPattern.test(path)) {
    throw new Error("Invalid path: Path cannot contain '../' or './'.");
  }

  // Ensure the path starts with the base path
  if (!path.startsWith(basePath)) {
    throw new Error(`Invalid path: Path must start with "${basePath}".`);
  }

  // If everything is valid, return the sanitized path
  return path;
}

function normaLisedPath(path) {
  return coreFolder + escapePathWithErrors(path);
}

function checkExtension(extension) {
  const allowedFiles = [
    ".jpg",
    ".png",
    ".gif",
    ".jpeg",
    ".svg",
    ".doc",
    ".txt",
    ".csv",
    ".docx",
    ".xls",
    ".xml",
    ".pdf",
    ".zip",
    ".ppt",
    ".mp4",
    ".ai",
    ".psd",
    ".mp3",
    ".avi",
  ];
  return extension !== ""
    ? allowedFiles.indexOf(extension) === -1
      ? false
      : true
    : true;
}

function checkVariables(variables) {
  let result = true;
  variables.forEach((element) => {
    if (element === "" || element === undefined) {
      result = false;
    }
  });
  return result;
}

module.exports = {
  escapePath,
  checkExtension,
  checkVariables,
  normaLisedPath,
  escapePathWithErrors,
};
