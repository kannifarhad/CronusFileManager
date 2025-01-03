/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2024, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/

const unzipper = require("unzipper");
const archiver = require("archiver");
const nodePath = require("path");
const coreFolder = nodePath.resolve(__dirname + "/../");
const {
  directoryTree,
  searchDirectoryTree,
} = require("../utilits/directory-tree");
const {
  checkExtension,
  escapePathWithErrors,
  checkVariables,
  normaLisedPath,
} = require("../utilits/filemanager");
const fs = require("graceful-fs");
const AppError = require("../utilits/appError");
const fsExtra = require("fs-extra");

module.exports = {
  async folderTree(req, res, next) {
    const { path } = req.body;
    const paths = await directoryTree(normaLisedPath(path), {
      normalizePath: true,
      removePath: coreFolder,
      withChildren: true,
    });
    res.status(200).send(paths);
  },
  async folderInfo(req, res, next) {
    const { path } = req.body;
    const paths = await directoryTree(normaLisedPath(path), {
      normalizePath: true,
      removePath: coreFolder,
      includeFiles: true,
    });
    res.status(200).send(paths);
  },
  async all(req, res, next) {
    const { path } = req.body;
    const paths = await directoryTree(normaLisedPath(path), {
      normalizePath: true,
      removePath: coreFolder,
      includeFiles: true,
      withChildren: true,
    });
    res.status(200).send(paths);
  },

  async search(req, res, next) {
    const { text } = req.body;
    const results = await searchDirectoryTree(normaLisedPath(), text, {
      normalizePath: true,
      removePath: coreFolder,
      includeFiles: true,
      withChildren: true,
    });
    res.status(200).send(results);
  },

  async rename(req, res, next) {
    let { path, newname } = req.body;
    path = normaLisedPath(path);

    if (!checkExtension(nodePath.extname(newname))) {
      return next(new AppError(`Wrong File Format ${newname}`, 400));
    }

    if (!checkVariables([path, newname])) {
      return next(new AppError("Variables not seted!", 400));
    }

    let editPath = path.split("/");
    editPath.pop();
    editPath.push(newname);
    let renamePath = editPath.join("/");
    fs.rename(
      `${coreFolder}/${path}`,
      `${coreFolder}/${renamePath}`,
      function (err) {
        if (err) {
          return next(new AppError(err, 400));
        } else {
          res.status(200).json({
            status: "success",
            message: "File or Folder succesfully renamed!",
          });
        }
      }
    );
  },

  async createfile(req, res, next) {
    let { path, file } = req.body;
    path = escapePathWithErrors(path);
    file = escapePathWithErrors(file);

    if (!checkExtension(nodePath.extname(file))) {
      return next(new AppError(`Wrong File Format ${file}`, 400));
    }
    if (!checkVariables([path, file])) {
      return next(new AppError("Variables not seted!", 400));
    }
    fs.open(`${coreFolder}${path}/${file}`, "wx", function (err, fd) {
      if (err) {
        return next(new AppError("Error while creating file", 400));
      }
      fs.close(fd, function (err) {
        if (err) {
          return next(new AppError("Error while closing file", 400));
        } else {
          res.status(200).json({
            status: "success",
            message: "File or Folder succesfully renamed!",
          });
        }
      });
    });
  },

  async createfolder(req, res, next) {
    let { path, folder, mask } = req.body;
    path = escapePathWithErrors(path);
    folder = escapePathWithErrors(folder);
    mask = typeof mask === "undefined" ? 0o777 : mask;

    fs.mkdir(`${coreFolder}${path}/${folder}`, mask, function (err) {
      if (err) {
        if (err.code == "EEXIST") {
          return next(new AppError("Folder already exists", 400));
        }
        return next(new AppError("Something goes wrong", 400));
      } else {
        res.status(200).json({
          status: "success",
          message: "Folder succesfully created!",
        });
      }
    });
  },

  async delete(req, res, next) {
    let { items } = req.body;
    if (!checkVariables([items])) {
      return next(new AppError("Variables not seted!", 400));
    }
    let pendingRequests = [];
    let errorDeleted = [];
    items.forEach(function (item, i, arr) {
      item = escapePathWithErrors(item);
      pendingRequests.push(
        fsExtra.remove(`${coreFolder}${item}`, (err) => {
          if (err) {
            errorDeleted.push({ item, err });
          }
        })
      );
    });
    Promise.all(pendingRequests)
      .then((values) => {
        res.status(200).json({
          status: "success",
          message: "File or folder succesfully deleted!",
        });
      })
      .catch((error) => {
        return next(new AppError(errorDeleted, 400));
      });
  },

  async emptydir(req, res, next) {
    let { path } = req.body;
    path = escapePathWithErrors(path);
    fsExtra.emptyDir(`${coreFolder}${path}`, (err) => {
      if (err) return next(new AppError(err, 400));
      res.status(200).json({
        status: "success",
        message: "All files and folder inside folder removed!",
      });
    });
  },

  async duplicate(req, res, next) {
    let { path } = req.body;
    path = escapePathWithErrors(path);
    if (!checkVariables([path])) {
      return next(new AppError("Variables not seted!", 400));
    }
    let nameNew = path.split(".");
    let timestamp = new Date().getTime();
    nameNew =
      nameNew.length > 1
        ? `${nameNew[0]}_${timestamp}.${nameNew[1]}`
        : `${nameNew[0]}_${timestamp}`;

    fsExtra.copy(`${coreFolder}${path}`, `${coreFolder}${nameNew}`, (err) => {
      if (err) {
        return next(new AppError(err, 400));
      }
      res.status(200).json({
        status: "success",
        message: "Files or folders succesfully duplicated!",
      });
    });
  },

  async copy(req, res, next) {
    let { items, destination } = req.body;
    destination = escapePathWithErrors(destination);
    if (!checkVariables([items, destination])) {
      return next(new AppError("Variables not seted!", 400));
    }
    let pendingRequests = [];
    let errorCopy = [];
    items.forEach(function (item, i, arr) {
      let newItem = escapePathWithErrors(item);
      let newdestination =
        `${coreFolder}${destination}/` + item.split("/").pop();
      pendingRequests.push(
        fsExtra.copy(`${coreFolder}${newItem}`, newdestination, (err) => {
          if (err) {
            errorCopy.push({ newItem, err });
          }
        })
      );
    });
    await Promise.all(pendingRequests)
      .then((values) => {
        res.status(200).json({
          status: "success",
          message: "Files or folders succesfully copied!",
        });
      })
      .catch((error) => {
        return next(new AppError(errorCopy, 400));
      });
  },

  async move(req, res, next) {
    let { items, destination } = req.body;
    destination = escapePathWithErrors(destination);
    if (!checkVariables([items, destination])) {
      return next(new AppError("Variables not seted!", 400));
    }
    let pendingRequests = [];
    let errorCopy = [];
    items.forEach(function (item, i, arr) {
      let newItem = escapePathWithErrors(item);
      let newdestination =
        `${coreFolder}${destination}/` + item.split("/").pop();
      pendingRequests.push(
        fsExtra.moveSync(`${coreFolder}${newItem}`, newdestination, {
          overwrite: true,
        })
      );
    });
    await Promise.all(pendingRequests).then((values) => {
      res.status(200).json({
        status: "success",
        message: "Files or folders succesfully moved!",
      });
    });
  },

  async unzip(req, res, next) {
    let { file, destination } = req.body;
    if (!checkVariables([file, destination])) {
      return next(new AppError("Variables not seted!", 400));
    }
    file = escapePathWithErrors(file);
    destination =
      destination === "" || destination === undefined
        ? file.split(".").shift()
        : escapePathWithErrors(destination);
    const zip = fs
      .createReadStream(`${coreFolder}${file}`)
      .pipe(unzipper.Parse({ forceStream: true }));
    for (const entry of zip) {
      if (checkExtension(nodePath.extname(entry.path))) {
        entry.pipe(
          fs.createWriteStream(`${coreFolder}${destination}/${entry.path}`)
        );
      } else {
        entry.autodrain();
      }
    }

    res.status(200).json({
      status: "success",
      message: "Archive successfully extracted!",
    });
  },

  async archive(req, res, next) {
    let { files, destination, name } = req.body;
    destination = await escapePathWithErrors(destination);
    name = await escapePathWithErrors(name);
    let output = fs.createWriteStream(
      `${coreFolder}${destination}/${name}.zip`
    );
    let archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    archive.pipe(output);
    archive.on("error", function (err) {
      return next(new AppError(err, 400));
    });

    await files.forEach(function (item, i, arr) {
      let newItem = `${coreFolder}${escapePathWithErrors(item)}`;
      let name = `${newItem.split("/").pop()}`;
      if (fs.lstatSync(newItem).isDirectory()) {
        archive.directory(newItem, name);
      } else {
        archive.file(newItem, { name });
      }
    });

    output.on("close", function () {
      res.status(200).json({
        status: "success",
        message: "Archive successfully created!",
      });
    });
    archive.finalize();
  },

  async saveImage(req, res, next) {
    let { path, file, isnew } = req.body;
    path = escapePathWithErrors(path);
    file = file.split(";base64,").pop();
    if (!checkExtension(nodePath.extname(path))) {
      return next(new AppError(`Wrong File Format ${path}`, 400));
    }
    if (!checkVariables([path, file])) {
      return next(new AppError("Variables not seted!", 400));
    }
    if (isnew) {
      let nameNew = path.split(".");
      let timestamp = new Date().getTime();
      path = `${nameNew[0]}_${timestamp}.${nameNew[1]}`;
    }
    fs.writeFile(
      `${coreFolder}${path}`,
      file,
      { encoding: "base64" },
      function (err) {
        if (err) {
          return next(new AppError("Error while creating file", 400));
        }
        res.status(200).json({
          status: "success",
          message: "File or Folder succesfully renamed!",
        });
      }
    );
  },

  async uploadFiles(req, res, next) {
    let { path, fileMaps } = req.body;
    let pathMappings = null;

    // Parse fileMaps if provided
    if (fileMaps) {
      pathMappings = JSON.parse(fileMaps) ?? [];
    }

    // Escape the path and ensure it’s valid
    path = escapePathWithErrors(path);

    // Check if files exist
    if (!Array.isArray(req.files) || req.files.length === 0) {
      return next(
        new AppError("No files had been sent or files list is empty", 400)
      );
    }

    // Process each file
    req.files.forEach(async (element, index) => {
      if (checkExtension(nodePath.extname(element.originalname))) {
        // Read the file from temp storage
        fs.readFile(element.path, async (err, data) => {
          if (err) {
            return next(
              new AppError(`Error reading file: ${err.message}`, 400)
            );
          }

          // Determine relative path and full path
          const relativePath =
            pathMappings.find((file) => file?.name === element.originalname)
              ?.path ?? `/${element.originalname}`;

          // Proper path concatenation
          const fullPath = nodePath.join(coreFolder, path, relativePath);

          // Ensure the directory exists before writing the file
          const dir = nodePath.dirname(fullPath);
          try {
            await fs.promises.mkdir(dir, { recursive: true }); // Create the directory if not exists
          } catch (mkdirError) {
            return next(
              new AppError(
                `Error creating directory: ${mkdirError.message}`,
                400
              )
            );
          }

          // Write the file to the new destination
          fs.writeFile(fullPath, data, (writeErr) => {
            if (writeErr) {
              return next(
                new AppError(`Error writing file: ${writeErr.message}`, 400)
              );
            }
          });
        });
      }
    });

    res.status(200).json({
      status: "success",
      message: "Files are successfully uploaded!",
    });
  },
};
