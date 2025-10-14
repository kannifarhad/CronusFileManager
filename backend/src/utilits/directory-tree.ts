/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import FS from "graceful-fs";
import PATH from "path";

export const constants = {
  DIRECTORY: "folder",
  FILE: "file",
} as const;

export type FileType = (typeof constants)[keyof typeof constants];

export interface Permissions {
  owner: string;
  group: string;
  others: string;
}

export interface TreeItem {
  path: string;
  name: string;
  created: Date;
  modified: Date;
  id: string;
  premissions: Permissions;
  type: FileType;
  size?: number;
  extension?: string;
  children?: TreeItem[];
  [key: string]: any; // for dynamic attributes (if options.attributes)
}

export interface DirectoryTreeOptions {
  exclude?: RegExp | RegExp[];
  includeFiles?: boolean;
  extensions?: RegExp;
  normalizePath?: boolean;
  removePath?: string;
  attributes?: string[];
  withChildren?: boolean;
}

/**
 * Safe read directory sync
 */
function safeReadDirSync(path: string): string[] | null {
  try {
    return FS.readdirSync(path);
  } catch (ex: any) {
    if (ex.code === "EACCES" || ex.code === "EPERM") {
      // User does not have permissions, ignore directory
      return null;
    } else throw ex;
  }
}

/**
 * Normalize path slashes
 */
function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

/**
 * Convert permission mode to human-readable strings
 */
function permissionsConvert(mode: number): Permissions {
  return {
    others: (mode & 1 ? "x-" : "") + (mode & 2 ? "w-" : "") + (mode & 4 ? "r" : ""),
    group: (mode & 10 ? "x-" : "") + (mode & 20 ? "w-" : "") + (mode & 40 ? "r" : ""),
    owner: (mode & 100 ? "x-" : "") + (mode & 200 ? "w-" : "") + (mode & 400 ? "r" : ""),
  };
}

/**
 * Get information about a file or directory.
 */
async function getItemInfo(fullPath: string, options: DirectoryTreeOptions): Promise<TreeItem> {
  try {
    const stats = FS.statSync(fullPath);
    const name = PATH.basename(fullPath);
    const isDirectory = stats.isDirectory();
    const type: FileType = isDirectory ? constants.DIRECTORY : constants.FILE;

    const itemPath = options?.normalizePath
      ? options.removePath
        ? normalizePath(fullPath).replace(normalizePath(options.removePath), "")
        : normalizePath(fullPath)
      : options?.removePath
      ? fullPath.replace(options.removePath, "")
      : fullPath;

    const treeItem: TreeItem = {
      path: itemPath,
      name,
      created: stats.birthtime,
      modified: stats.mtime,
      id: `${type}_${stats.ino}`,
      premissions: permissionsConvert(stats.mode),
      type,
    };

    if (type === constants.FILE) {
      const ext = PATH.extname(fullPath).toLowerCase();
      treeItem.size = stats.size;
      treeItem.extension = ext;
    }

    return treeItem;
  } catch (err) {
    console.error(`Error retrieving info for: ${fullPath}`, err);
    throw err;
  }
}

/**
 * Recursively collects files/folders for a directory path.
 */
export async function directoryTree(
  path: string,
  options: DirectoryTreeOptions,
  onEachFile?: (item: TreeItem, path: typeof PATH, stats: FS.Stats) => void,
  onEachDirectory?: (item: TreeItem, path: typeof PATH, stats: FS.Stats) => void,
  depth?: boolean
): Promise<TreeItem | null> {
  let item: TreeItem;

  try {
    item = await getItemInfo(path, options);
  } catch (e: any) {
    console.error(`Error retrieving info for ${path}: ${e.message}`);
    return null;
  }

  // Exclusions
  if (options?.exclude) {
    const excludes = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
    if (excludes.some((exclusion) => exclusion.test(path))) {
      return null;
    }
  }

  // Handle files
  if (item.type === constants.FILE && options.includeFiles) {
    const ext = PATH.extname(path).toLowerCase();

    if (options.extensions && !options.extensions.test(ext)) return null;

    if (options.attributes) {
      options.attributes.forEach((attribute) => {
        item[attribute] = item[attribute] || null;
      });
    }

    if (onEachFile) {
      const stats = FS.statSync(path);
      onEachFile(item, PATH, stats);
    }

    return item;
  }

  // Handle directories
  if (item.type === constants.DIRECTORY) {
    const dirData = safeReadDirSync(path);
    if (dirData === null) return null;

    if (options.attributes) {
      options.attributes.forEach((attribute) => {
        item[attribute] = item[attribute] || null;
      });
    }

    const children = await Promise.all(
      dirData.map(async (child) => directoryTree(PATH.join(path, child), options, onEachFile, onEachDirectory, true))
    );

    item.children = children.filter((e): e is TreeItem => !!e);
    item.size = item.children.reduce((prev, cur) => prev + (cur.size || 0), 0);

    if (onEachDirectory) {
      const stats = FS.statSync(path);
      onEachDirectory(item, PATH, stats);
    }

    return item;
  }

  return null;
}

/**
 * Recursively searches for files/folders matching a string.
 */
export async function searchDirectoryTree(
  dir: string,
  searchString: string,
  options: DirectoryTreeOptions = {}
): Promise<TreeItem[]> {
  const results: TreeItem[] = [];
  const items = safeReadDirSync(dir);
  if (!items) return results;

  for (const item of items) {
    const fullPath = PATH.join(dir, item);
    let treeItem: TreeItem;

    try {
      treeItem = await getItemInfo(fullPath, options);
    } catch (e: any) {
      console.error(`Error getting stats for ${fullPath}: ${e.message}`);
      continue;
    }

    if (PATH.basename(fullPath).toLowerCase().includes(searchString.toLowerCase())) {
      results.push(treeItem);
    }

    if (treeItem.type === constants.DIRECTORY) {
      const subItems = await searchDirectoryTree(fullPath, searchString, options);
      results.push(...subItems);
    }
  }

  return results;
}
