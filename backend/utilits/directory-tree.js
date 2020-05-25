/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2019, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
**/

'use strict';

const FS = require('graceful-fs');
const PATH = require('path');
const constants = {
	DIRECTORY: 'folder',
	FILE: 'file'
}

function safeReadDirSync (path) {
	let dirData = {};
	try {
		dirData = FS.readdirSync(path);
	} catch(ex) {
		if (ex.code == "EACCES" || ex.code == "EPERM") {
			//User does not have permissions, ignore directory
			return null;
		}
		else throw ex;
	}
	return dirData;
}

/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param  {string} path
 * @return {string}
 */
function normalizePath(path) {
	return path.replace(/\\/g, '/');
}

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
function isRegExp(regExp) {
	return typeof regExp === "object" && regExp.constructor == RegExp;
}
function permissionsConvert(mode){
	return {
		'others': (mode & 1 ? 'x-' : '') + (mode & 2 ? 'w-' : '')+  (mode & 4 ? 'r' : ''),
		'group':  (mode & 10 ? 'x-' : '') + (mode & 20 ? 'w-' : '') +  (mode & 40 ? 'r' : ''),
		'owner':  (mode & 100 ? 'x-' : '') + (mode & 200 ? 'w-' : '') +  (mode & 400 ? 'r' : ''),
	}
}

/**
 * Collects the files and folders for a directory path into an Object, subject
 * to the options supplied, and invoking optional
 * @param  {String} path
 * @param  {Object} options
 * @param  {function} onEachFile
 * @param  {function} onEachDirectory
 * @return {Object}
 */
function directoryTree (path, options, onEachFile, onEachDirectory, depth) {
	const name = PATH.basename(path);
	const item = { path, name };
	let stats;

	try { stats = FS.statSync(path); }
	catch (e) { return null; }

	// Skip if it matches the exclude regex
	if (options && options.exclude) {
		const excludes =  isRegExp(options.exclude) ? [options.exclude] : options.exclude;
		if (excludes.some((exclusion) => exclusion.test(path))) {
			return null;
		}
	}
	item.created = stats.birthtime;
	item.modified = stats.mtime;
	item.type = constants.DIRECTORY;
	item.id = `${item.type}_${stats.ino}`;
	item.premissions = permissionsConvert(stats.mode);

	if (stats.isFile() && options.includeFiles) {

		const ext = PATH.extname(path).toLowerCase();
		// Skip if it does not match the extension regex
		if (options && options.extensions && !options.extensions.test(ext))
			return null;

		item.size = stats.size;  // File size in bytes
		item.extension = ext;
		item.type = constants.FILE;
		

		if (options && options.attributes) {
			options.attributes.forEach((attribute) => {
				item[attribute] = stats[attribute];
			});
		}

		if (onEachFile) {
			onEachFile(item, PATH, stats);
		}
	}
	else if (stats.isDirectory()) {

		let dirData = safeReadDirSync(path);
		if (dirData === null) return null;

		if (options && options.attributes) {
			options.attributes.forEach((attribute) => {
				item[attribute] = stats[attribute];
			});
		}

		if(!options.withChildren){
			if(!depth){
				item.children = dirData
					.map(child => directoryTree(PATH.join(path, child), options, onEachFile, onEachDirectory, true))
					.filter(e => !!e);
					item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
				if (onEachDirectory) {
					onEachDirectory(item, PATH, stats);
				}
			}
			
		}else {
			item.children = dirData
			.map(child => directoryTree(PATH.join(path, child), options, onEachFile, onEachDirectory, false))
			.filter(e => !!e);
			item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
			if (onEachDirectory) {
				onEachDirectory(item, PATH, stats);
			}
		}

		

	} else {
		return null; // Or set item.size = 0 for devices, FIFO and sockets ?
	}
	item.path = options && options.normalizePath ? 
					(options.removePath) ? normalizePath(item.path).replace(normalizePath(options.removePath),'') :  normalizePath(item.path)
					: (options.removePath) ? item.path.replace(options.removePath,'') :  item.path;
	return item;
}

module.exports = directoryTree;