import nodePath from "path";

export const FILE_STORAGE_MAIN_FOLDER = "uploads";
export const FILE_STORAGE_TRASH_FOLDER = "trash";
export const FILE_STORAGE_TMP_FOLDER = nodePath.join(FILE_STORAGE_MAIN_FOLDER, "tmp");

export const ALLOWED_FILE_EXTENSIONS = [
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
  ".mp4",
  ".avi",
  ".heic",
  ".webm"
];
