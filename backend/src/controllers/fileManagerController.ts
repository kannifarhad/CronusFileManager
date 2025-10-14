/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import unzipper from "unzipper";
import archiver from "archiver";
import nodePath from "path";
import fs from "graceful-fs";
import fsExtra from "fs-extra";
import { Request, Response, NextFunction } from "express";
import { directoryTree, searchDirectoryTree } from "../utilits/directory-tree.js";
import {
  checkExtension,
  escapePathWithErrors,
  checkVariables,
  normaLisedPath,
  getDirname,
} from "../utilits/filemanager.js";
import AppError from "../utilits/appError.js";
import AbstractFileManager from "../sdk/LocalFileManagerSDK.js";

const __dirname = getDirname(import.meta.url);
const coreFolder = nodePath.resolve(`${__dirname}/../`);

export class FileManagerController {
  protected filemanagerService: AbstractFileManager;
  constructor(filemanagerService: AbstractFileManager) {
    this.filemanagerService = filemanagerService;
  }

  folderTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paths = await this.filemanagerService.getFolderTree({ prefix: "", withChildren: true });
      res.status(200).json(paths);
    } catch (err) {
      next(err);
    }
  };

  folderInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path } = req.body;
      const paths = await this.filemanagerService.getFolderInfo(path);
      res.status(200).json(paths);
    } catch (err) {
      next(err);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, path } = req.body;
      const results = await this.filemanagerService.search({ text, path });
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  };

  rename = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { path, newname } = req.body;
      await this.filemanagerService.rename({ newname, path });

      res.status(200).json({
        status: "success",
        message: "File or Folder successfully renamed!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { items } = req.body;

      await this.filemanagerService.delete({ items });

      res.status(200).json({
        status: "success",
        message: "File or folder successfully deleted!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  createFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { path, file } = req.body;
      await this.filemanagerService.createFile({ path, file });

      res.status(200).json({
        status: "success",
        message: "File successfully created!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  createFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path, folder, mask } = req.body;
      await this.filemanagerService.createFolder({ path, folder, mask });

      res.status(200).json({
        status: "success",
        message: "Folder successfully created!",
      });
    } catch (err: any) {
      if (err.code === "EEXIST") {
        return next(new AppError("Folder already exists", 400));
      }
      next(new AppError(err.message, 400));
    }
  };

  emptyDir = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { path } = req.body;
      await this.filemanagerService.emptyDir({ path });
      res.status(200).json({
        status: "success",
        message: "All files and folders inside folder removed!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  duplicate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { path } = req.body;
      await this.filemanagerService.duplicate({ path });

      res.status(200).json({
        status: "success",
        message: "Files or folders successfully duplicated!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  copy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { items, destination } = req.body;
      await this.filemanagerService.copy({ items, destination });

      res.status(200).json({
        status: "success",
        message: "Files or folders successfully copied!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  move = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { items, destination } = req.body;
      await this.filemanagerService.move({ items, destination });

      res.status(200).json({
        status: "success",
        message: "Files or folders successfully moved!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  async unzip(req: Request, res: Response, next: NextFunction) {
    try {
      let { file, destination } = req.body;

      if (!checkVariables([file, destination])) {
        return next(new AppError("Variables not set!", 400));
      }

      file = escapePathWithErrors(file);
      destination = !destination || destination === "" ? file.split(".").shift()! : escapePathWithErrors(destination);

      const zip = fs.createReadStream(nodePath.join(coreFolder, file)).pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of zip) {
        if (checkExtension(nodePath.extname(entry.path))) {
          const outPath = nodePath.join(coreFolder, destination, entry.path);
          await fs.promises.mkdir(nodePath.dirname(outPath), { recursive: true });
          entry.pipe(fs.createWriteStream(outPath));
        } else {
          entry.autodrain();
        }
      }

      res.status(200).json({
        status: "success",
        message: "Archive successfully extracted!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  async archive(req: Request, res: Response, next: NextFunction) {
    try {
      let { files, destination, name } = req.body;
      destination = escapePathWithErrors(destination);
      name = escapePathWithErrors(name);

      const output = fs.createWriteStream(nodePath.join(coreFolder, destination, `${name}.zip`));
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.pipe(output);
      archive.on("error", (err) => {
        throw new AppError(err.message, 400);
      });

      for (const item of files) {
        const newItem = nodePath.join(coreFolder, escapePathWithErrors(item));
        const fileName = nodePath.basename(newItem);
        if ((await fs.promises.lstat(newItem)).isDirectory()) {
          archive.directory(newItem, fileName);
        } else {
          archive.file(newItem, { name: fileName });
        }
      }

      await archive.finalize();

      output.on("close", () => {
        res.status(200).json({
          status: "success",
          message: "Archive successfully created!",
        });
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  async saveImage(req: Request, res: Response, next: NextFunction) {
    try {
      let { path, file, isnew } = req.body;
      path = escapePathWithErrors(path);
      file = file.split(";base64,").pop()!;
      if (!checkExtension(nodePath.extname(path))) {
        return next(new AppError(`Wrong File Format ${path}`, 400));
      }
      if (!checkVariables([path, file])) {
        return next(new AppError("Variables not set!", 400));
      }
      if (isnew) {
        const nameParts = path.split(".");
        const timestamp = Date.now();
        path = `${nameParts[0]}_${timestamp}.${nameParts[1]}`;
      }

      const filePath = nodePath.join(coreFolder, path);
      await fs.promises.mkdir(nodePath.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, file, { encoding: "base64" });

      res.status(200).json({
        status: "success",
        message: "File successfully saved!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  async uploadFiles(req: Request & { files?: Express.Multer.File[] }, res: Response, next: NextFunction) {
    try {
      let { path, fileMaps } = req.body;
      path = escapePathWithErrors(path);

      let pathMappings: Array<{ name: string; path: string }> = [];
      if (fileMaps) {
        pathMappings = JSON.parse(fileMaps) ?? [];
      }

      if (!req.files || req.files.length === 0) {
        return next(new AppError("No files have been sent or files list is empty", 400));
      }

      await Promise.all(
        req.files.map(async (file) => {
          if (!checkExtension(nodePath.extname(file.originalname))) return;

          const data = await fs.promises.readFile(file.path);

          const relativePath =
            pathMappings.find((map) => map.name === file.originalname)?.path ?? `/${file.originalname}`;

          const fullPath = nodePath.join(coreFolder, path, relativePath);

          await fs.promises.mkdir(nodePath.dirname(fullPath), { recursive: true });
          await fs.promises.writeFile(fullPath, data);
        })
      );

      res.status(200).json({
        status: "success",
        message: "Files are successfully uploaded!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }
}

// ✅ Export default instance for routers
export default FileManagerController;
