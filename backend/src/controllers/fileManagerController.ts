/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import { Request, Response, NextFunction } from "express";
import AppError from "../utilits/appError.js";
import FileManagerSDKBase from "../sdk/LocalFileManagerSDK";
import { FileUpload } from "../sdk/types";
import { FileManagerFactory } from "../sdk/index";

export class FileManagerController {
  protected filemanagerService: FileManagerSDKBase;
  constructor(factory: FileManagerFactory) {
    this.filemanagerService = factory.createProxy();
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

  unzip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { file, destination } = req.body;
      await this.filemanagerService.unzip({ file, destination });

      res.status(200).json({
        status: "success",
        message: "Archive successfully extracted!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  archive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { files, destination, name } = req.body;
      await this.filemanagerService.archive({ files, destination, name });

      res.status(200).json({
        status: "success",
        message: "Archive successfully created!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { path, file, isnew } = req.body;
      await this.filemanagerService.saveImage({ path, file, isnew });

      res.status(200).json({
        status: "success",
        message: "File successfully saved!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };

  getFile = async (req: Request, res: Response) => {
    try {
      const relativePath = decodeURIComponent(req.originalUrl);
      if (!relativePath) {
        return res.status(400);
      }
      const fullPath = await this.filemanagerService.getLink({ path: relativePath });
      res.sendFile(fullPath);
    } catch (err: any) {
      return res.status(400);
    }
  };

  uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { path, fileMaps } = req.body;
      const { files } = req;
      await this.filemanagerService.uploadFiles({
        path,
        files: files as FileUpload[],
        fileMaps: JSON.parse(fileMaps),
      });

      res.status(200).json({
        status: "success",
        message: "Files are successfully uploaded!",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  };
}

export default FileManagerController;
