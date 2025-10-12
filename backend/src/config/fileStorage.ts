import nodePath from "path";
import { fileURLToPath } from "url";
import path from "path";

// Recreate CommonJS globals for ESM
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


const coreFolder = nodePath.resolve(`${__dirname}/../`);

export const FILE_STORAGE_MAIN_FOLDER = "uploads";
export const FILE_STORAGE_TRASH_FOLDER = "trash";
export const FILE_STORAGE_TMP_FOLDER = nodePath.join(coreFolder, FILE_STORAGE_MAIN_FOLDER, "tmp");
