/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import nodePath from "path";
import { FILE_STORAGE_MAIN_FOLDER } from "../config/fileStorage";
import { fileURLToPath } from "url";
import path from "path";

// Recreate CommonJS globals for ESM
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

/**
 * Helper to get __dirname of the caller module dynamically.
 * Usage: getDirname(import.meta.url)
 */
export function getDirname(metaUrl: string): string {
  return path.dirname(fileURLToPath(metaUrl));
}

const coreFolder = nodePath.resolve(`${__dirname}/../`);

/**
 * Escapes and validates a file path.
 * Returns a safe fallback path if invalid.
 */
export function escapePath(path: string): string {
  const defaultPath = `/${FILE_STORAGE_MAIN_FOLDER}/`;

  if (typeof path !== "string" || path.trim() === "") {
    return defaultPath;
  }

  const invalidPattern = /(\.\.\/|\.\/|^\/$)/;
  if (invalidPattern.test(path)) {
    return defaultPath;
  }

  // Prevent directory traversal or malformed input
  if (path.startsWith("/") || path.endsWith("/")) {
    return defaultPath;
  }

  return path;
}

/**
 * Escapes a path, but throws errors if invalid.
 * Use when you want strict validation.
 */
export function escapePathWithErrors(path: string): string {
  const basePath = `/${FILE_STORAGE_MAIN_FOLDER}/`;

  if (typeof path !== "string" || path.trim() === "") {
    return basePath;
  }

  const invalidPattern = /(\.\.\/|\.\/|^\/$)/;
  if (invalidPattern.test(path)) {
    throw new Error("Invalid path: Path cannot contain '../' or './'.");
  }

  if (!path.startsWith(basePath)) {
    throw new Error(`Invalid path: Path must start with "${basePath}".`);
  }

  return path;
}

/**
 * Returns a fully resolved and validated normalized path.
 */
export function normaLisedPath(path: string): string {
  return nodePath.join(coreFolder, escapePathWithErrors(path));
}

/**
 * Validates if a given file extension is allowed.
 */
export function checkExtension(extension: string): boolean {
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

  if (!extension) return true;
  return allowedFiles.includes(extension);
}

/**
 * Checks that all variables in an array are defined and non-empty.
 */
export function checkVariables(variables: Array<string | undefined>): boolean {
  return variables.every((element) => element !== "" && element !== undefined);
}
