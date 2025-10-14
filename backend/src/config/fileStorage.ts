import nodePath from "path";

export const FILE_STORAGE_MAIN_FOLDER = "uploads";
export const FILE_STORAGE_TRASH_FOLDER = "trash";
export const FILE_STORAGE_TMP_FOLDER = nodePath.join(FILE_STORAGE_MAIN_FOLDER, "tmp");
