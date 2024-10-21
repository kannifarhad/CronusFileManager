/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2024, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/

"use strict";

const FS = require("graceful-fs");
const PATH = require("path");
const constants = {
  DIRECTORY: "folder",
  FILE: "file",
};

function safeReadDirSync(path) {
  let dirData = {};
  try {
    dirData = FS.readdirSync(path);
  } catch (ex) {
    if (ex.code == "EACCES" || ex.code == "EPERM") {
      //User does not have permissions, ignore directory
      return null;
    } else throw ex;
  }
  return dirData;
}

/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param  {string} path
 * @return {string}
 */
function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
function isRegExp(regExp) {
  return typeof regExp === "object" && regExp.constructor == RegExp;
}
function permissionsConvert(mode) {
  return {
    others:
      (mode & 1 ? "x-" : "") + (mode & 2 ? "w-" : "") + (mode & 4 ? "r" : ""),
    group:
      (mode & 10 ? "x-" : "") +
      (mode & 20 ? "w-" : "") +
      (mode & 40 ? "r" : ""),
    owner:
      (mode & 100 ? "x-" : "") +
      (mode & 200 ? "w-" : "") +
      (mode & 400 ? "r" : ""),
  };
}

/**
 * Recursively collects the files and folders for a directory path into an Object, subject
 * to the options supplied, invoking optional callbacks for each file or directory.
 * @param {String} path - The starting directory path.
 * @param {Object} options - Options to configure the behavior of the tree generation.
 * @param {function} onEachFile - Optional callback invoked on each file.
 * @param {function} onEachDirectory - Optional callback invoked on each directory.
 * @param {Boolean} depth - Indicator of recursion depth, for internal use.
 * @return {Promise<Object>} - Directory tree structure.
 */
async function directoryTree(path, options, onEachFile, onEachDirectory, depth) {
	let item;
  
	try {
	  // Use getItemInfo to retrieve info about the current item (file/directory)
	  item = await getItemInfo(path, options);
	} catch (e) {
	  console.error(`Error retrieving info for ${path}: ${e.message}`);
	  return null;
	}
  
	// Skip if the item matches the exclude regex
	if (options && options.exclude) {
	  const excludes = Array.isArray(options.exclude)
		? options.exclude
		: [options.exclude];
	  if (excludes.some((exclusion) => exclusion.test(path))) {
		return null;
	  }
	}
  
	// Handle files
	if (item.type === constants.FILE && options.includeFiles) {
	  const ext = PATH.extname(path).toLowerCase();
  
	  // Skip if it doesn't match the specified extensions regex
	  if (options.extensions && !options.extensions.test(ext)) {
		return null;
	  }
  
	  // Add extra attributes if requested
	  if (options.attributes) {
		options.attributes.forEach((attribute) => {
		  item[attribute] = item[attribute] || null;
		});
	  }
  
	  // Call the onEachFile callback if provided
	  if (onEachFile) {
		onEachFile(item, PATH, item.stats);
	  }
  
	  // Return file object
	  return item;
  
	} 
	// Handle directories
	else if (item.type === constants.DIRECTORY) {
	  const dirData = safeReadDirSync(path);
	  if (dirData === null) return null;
  
	  // Add extra attributes if requested
	  if (options.attributes) {
		options.attributes.forEach((attribute) => {
		  item[attribute] = item[attribute] || null;
		});
	  }
  
	  // Recursively handle children (files/folders)
	  const children = await Promise.all(
		dirData.map(async (child) => 
		  await directoryTree(PATH.join(path, child), options, onEachFile, onEachDirectory, true)
		)
	  );
	  item.children = children.filter((e) => !!e);  // Only keep non-null children
  
	  // Calculate directory size based on its children
	  item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
  
	  // Call the onEachDirectory callback if provided
	  if (onEachDirectory) {
		onEachDirectory(item, PATH, item.stats);
	  }
  
	  // Return directory object
	  return item;
	} else {
	  return null;  // Handle non-regular files if necessary
	}
  }

/**
 * Recursively searches for files and folders matching the search string.
 * Returns the same data structure as directoryTree function.
 * @param {string} dir - The starting directory.
 * @param {string} searchString - The string to search for in folder and file names.
 * @param {Object} options - Options similar to directoryTree function.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of matching paths with directoryTree structure.
 */
async function searchDirectoryTree(dir, searchString, options = {}) {
	let results = [];
  
	try {
	  // Read the contents of the directory
	  const items = await safeReadDirSync(dir);
  
	  // Iterate over all items in the directory
	  for (const item of items) {
		const fullPath = PATH.join(dir, item);
		let treeItem;
  
		try {
		  // Gather information about the item (file/directory)
		  treeItem = await getItemInfo(fullPath, options);
		} catch (e) {
		  console.error(`Error getting stats for ${fullPath}: ${e.message}`);
		  continue;
		}
  
		// Check if the item matches the search string (case-insensitive)
		if (PATH.basename(fullPath).toLowerCase().includes(searchString.toLowerCase())) {
		  results.push(treeItem);
		}
  
		// If it's a directory, recurse into it
		if (treeItem.type === constants.DIRECTORY) {
		  const subItems = await searchDirectoryTree(fullPath, searchString, options);
		  results.push(...subItems); // Add subdirectory matches to the result
		}
	  }
	} catch (err) {
	  console.error(`Error while reading directory: ${dir}`, err);
	}
  
	return results;
  }
  
  /**
   * Retrieves information about a file or directory in the desired format.
   * @param {string} fullPath - Full path to the item.
   * @param {Object} options - Options for formatting.
   * @returns {Object} - The file or directory information.
   */
  async function getItemInfo(fullPath, options) {
	try {
	  const stats = FS.statSync(fullPath);
	  const name = PATH.basename(fullPath);
	  const isDirectory = stats.isDirectory();
	  const type = isDirectory ? constants.DIRECTORY : constants.FILE;
	  const itemPath = options && options.normalizePath
		? options.removePath
		  ? normalizePath(fullPath).replace(normalizePath(options.removePath), "")
		  : normalizePath(fullPath)
		: options.removePath
		? fullPath.replace(options.removePath, "")
		: fullPath;
  
	  const treeItem = {
		path: itemPath,
		name: name,
		created: stats.birthtime,
		modified: stats.mtime,
		id: `${type}_${stats.ino}`,
		premissions: permissionsConvert(stats.mode),
		type,
	  };
  
	  if (type === constants.FILE) {
		const ext = PATH.extname(fullPath).toLowerCase();
		treeItem.size = stats.size;  // File size in bytes
		treeItem.extension = ext;
	  }
  
	  return treeItem;
	} catch (err) {
	  console.error(`Error retrieving info for: ${fullPath}`, err);
	  throw err;
	}
  }

module.exports = { directoryTree, searchDirectoryTree };
