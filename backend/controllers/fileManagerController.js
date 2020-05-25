/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2019, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
**/

const unzipper = require('unzipper');
const archiver = require('archiver');
const nodePath = require('path');
const coreFolder = nodePath.resolve(__dirname + '/../');
const dirTree = require('../utilits/directory-tree');
const {escapePath, checkExtension, checkVariables} = require('../utilits/filemanager');
const fs = require('graceful-fs');
const AppError = require('../utilits/appError');
const fsExtra = require('fs-extra');
const errorMessages = require('../config/lang/en.json')['messages']['errors'];

module.exports = {

    async folderTree(req, res, next) {
        const { path } = req.body;
        const paths = dirTree(coreFolder + escapePath(path), {normalizePath: true, removePath:coreFolder, withChildren: true});
        res.status(200).send(paths);
    },
    async folderInfo(req, res, next) {
        const { path } = req.body;
        const paths = dirTree(coreFolder + escapePath(path), {normalizePath: true, removePath:coreFolder, includeFiles: true});
        res.status(200).send(paths);
    },
    async all(req, res, next) {
        const { path } = req.body;
        const paths = dirTree(coreFolder + escapePath(path), {normalizePath: true, removePath:coreFolder, includeFiles: true, withChildren: true});
        res.status(200).send(paths);
    },

    async rename(req, res, next) {
        let { path, newname } = req.body;
        path = escapePath(path);

        if(!checkExtension(nodePath.extname(newname))){
            return next(new AppError(`Wrong File Format ${newname}`, 400));
        }

        if(!checkVariables([path, newname])){
            return next(new AppError('Variables not seted!', 400));
        }

        let editPath = path.split("/");
        editPath.pop();
        editPath.push(newname);
        let renamePath = editPath.join('/');
        fs.rename(`${coreFolder}/${path}`, `${coreFolder}/${renamePath}`, function (err) {
            if (err) {
                return next(new AppError(err, 400));
            } else {
                res.status(200).json({
                    'status': 'success',
                    'message': 'File or Folder succesfully renamed!'
                });
            }
        });
    },

    async createfile(req, res, next) {
        let { path, file } = req.body;
            path = escapePath(path);
            file = escapePath(file);
            
        if(!checkExtension(nodePath.extname(file))){
            return next(new AppError(`Wrong File Format ${file}`, 400));
        }
        if(!checkVariables([path, file])){
            return next(new AppError('Variables not seted!', 400));
        }
        fs.open(`${coreFolder}${path}/${file}`, "wx", function (err, fd) {
            if(err){ 
                return next(new AppError("Error while creating file", 400)); 
            }
            fs.close(fd, function (err) {
                if(err){ 
                    return next(new AppError("Error while closing file", 400)); 
                } else {
                    res.status(200).json({
                        'status': 'success',
                        'message': 'File or Folder succesfully renamed!'
                    });
                }
            });
        });

    },

    async createfolder(req, res, next) {
        let { path, folder, mask } = req.body;
            path = escapePath(path);
            folder = escapePath(folder);
            mask = (typeof mask === 'undefined') ? 0777 : mask;

        fs.mkdir(`${coreFolder}${path}/${folder}`, mask, function(err) {
            if (err) {
                if (err.code == 'EEXIST'){
                    return next(new AppError("Folder already exists", 400)); 
                }
                return next(new AppError("Something goes wrong", 400)); 
            } else {
                res.status(200).json({
                    'status': 'success',
                    'message': 'Folder succesfully created!'
                });
            }
        });

    },

    async delete(req, res, next) {
        let { items } = req.body;
        if(!checkVariables([items])){
            return next(new AppError('Variables not seted!', 400));
        }
        var pendingRequests = [];
        var errorDeleted = [];
            items.forEach(function(item, i, arr) {
                item = escapePath(item);
                pendingRequests.push(
                    fsExtra.remove(`${coreFolder}${item}`, err=>{
                            if (err) {
                                errorDeleted.push({item, err});
                            }
                    })
                )
            });
            Promise.all(pendingRequests)
            .then(values => { 
                res.status(200).json({
                                    'status': 'success',
                                    'message': 'File or folder succesfully deleted!'
                                });
            })
            .catch(error => { 
                return next(new AppError(errorDeleted, 400));
            });
    },

    async emptydir(req, res, next) {
        let { path } = req.body;
        path = escapePath(path);
        fsExtra.emptyDir(`${coreFolder}${path}`, err => {
            if (err) return next(new AppError(err, 400));
            res.status(200).json({
                'status': 'success',
                'message': 'All files and folder inside folder removed!'
            });
          })
    },

    async duplicate(req, res, next) {
        let { path } = req.body;
        path = escapePath(path);
        if(!checkVariables([path])){
            return next(new AppError('Variables not seted!', 400));
        }
        var nameNew = path.split('.');
        var timestamp = new Date().getTime();
        nameNew = nameNew.length > 1 ? `${nameNew[0]}_${timestamp}.${nameNew[1]}` : `${nameNew[0]}_${timestamp}`;

        fsExtra.copy(`${coreFolder}${path}`, `${coreFolder}${nameNew}`, err=>{
            if (err) {
                return next(new AppError(err, 400));
            }
            res.status(200).json({
                'status': 'success',
                'message': 'Files or folders succesfully duplicated!'
            });
        });
    },

    async copy(req, res, next) {
        let { items, destination } = req.body;
        destination = escapePath(destination);
        if(!checkVariables([items, destination])){
            return next(new AppError('Variables not seted!', 400));
        }
        var pendingRequests = [];
        var errorCopy = [];
            items.forEach(function(item, i, arr) {
                let newItem = escapePath(item);
                let newdestination =  `${coreFolder}${destination}/` + item.split('/').pop();
                pendingRequests.push(
                    fsExtra.copy(`${coreFolder}${newItem}`, newdestination, err=>{
                            if (err) {
                                errorCopy.push({newItem, err});
                            }
                    })
                )
            });
            Promise.all(pendingRequests)
            .then(values => { 
                res.status(200).json({
                                    'status': 'success',
                                    'message': 'Files or folders succesfully copied!'
                                });
            })
            .catch(error => { 
                return next(new AppError(errorCopy, 400));
            });
    },

    async move(req, res, next) {
        let { items, destination } = req.body;
        destination = escapePath(destination);
        if(!checkVariables([items, destination])){
            return next(new AppError('Variables not seted!', 400));
        }
        var pendingRequests = [];
        var errorCopy = [];
        try {
            items.forEach(function(item, i, arr) {
                let newItem = escapePath(item);
                let newdestination =   `${coreFolder}${destination}/` + item.split('/').pop();
                pendingRequests.push(
                    fsExtra.moveSync(`${coreFolder}${newItem}`, newdestination, { overwrite: true })
                )
            });
            Promise.all(pendingRequests)
            .then(values => { 
                res.status(200).json({
                                    'status': 'success',
                                    'message': 'Files or folders succesfully moved!'
                                });
            })
        } catch (error) {
            return next(new AppError(error, 400));

        }
    },

    async unzip(req, res, next) {
        let { file, destination } = req.body;
        if(!checkVariables([file, destination])){
            return next(new AppError('Variables not seted!', 400));
        }
        file = escapePath(file);
        destination = (destination === '' || destination === undefined) ? file.split(".").shift() :  escapePath(destination);
        try {
                const zip = fs.createReadStream(`${coreFolder}${file}`).pipe(unzipper.Parse({forceStream: true}));
                for (const entry of zip) {
                    if(checkExtension(nodePath.extname(entry.path))){
                        entry.pipe(fs.createWriteStream(`${coreFolder}${destination}/${entry.path}`));
                    } else {
                        entry.autodrain();
                    }
                }

                res.status(200).json({
                    'status': 'success',
                    'message': 'Archive successfully extracted!'
                });
                
        } catch (error) {
            return next(new AppError(error, 400));
        }
    },

    async archive(req, res, next) {
        let { files, destination, name } = req.body;
        destination = await escapePath(destination);
        name = await escapePath(name);
        try {
            var output = fs.createWriteStream(`${coreFolder}${destination}/${name}.zip`);
            var archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });

            archive.pipe(output);
            archive.on('error', function(err) {
                return next(new AppError(err, 400));
            });

            await files.forEach(function(item, i, arr) {
                let newItem = `${coreFolder}${escapePath(item)}`;
                let name =  `${newItem.split("/").pop()}`;
                if(fs.lstatSync(newItem).isDirectory()){
                    archive.directory(newItem, name);
                }else{
                    archive.file(newItem, {name});
                }                
            });

            output.on('close', function() {
                res.status(200).json({
                    'status': 'success',
                    'message': 'Archive successfully created!'
                });
            });
            archive.finalize();
        } catch (error) {
            return next(new AppError(error, 400));
        }
    },

    async saveImage(req, res, next) {
        let { path, file, isnew } = req.body;
        path = escapePath(path);
        file = file.split(';base64,').pop();;
        if(!checkExtension(nodePath.extname(path))){
            return next(new AppError(`Wrong File Format ${path}`, 400));
        }
        if(!checkVariables([path, file])){
            return next(new AppError('Variables not seted!', 400));
        }
        if(isnew){
            var nameNew = path.split('.');
            var timestamp = new Date().getTime();
            path = `${nameNew[0]}_${timestamp}.${nameNew[1]}`;
        }
        fs.writeFile(`${coreFolder}${path}`, file, {encoding: 'base64'}, function(err) {
            if(err){ 
                return next(new AppError("Error while creating file", 400)); 
            }
            res.status(200).json({
                'status': 'success',
                'message': 'File or Folder succesfully renamed!'
            });
        });
    },

    async uploadFiles(req, res, next) {
        let { path } = req.body;
        path = escapePath(path);

        try { 
            req.files.forEach(function (element, index, array) {
                if(checkExtension(nodePath.extname(element.originalname))){
                    fs.readFile(element.path, function (err, data) {
                        fs.writeFile(`${coreFolder}${path}/${element.originalname}`, data, function (err) {
                              if(err) {
                                return next(new AppError(err.message, 400));
                              }
                              
                        });
                      });
                }
            });
        } catch (error) {
            return next(new AppError(error.message, 400));
        }

        res.status(200).json({
            'status': 'success',
            'message': 'Files are succesfully uploaded!'
        });
    },
   
}