import express, { Request, Response, NextFunction, Router } from "express";
import fsExtra from "fs-extra";

/**
 * Middleware to clean up uploaded files after request completion
 * Should be added AFTER the route handler
 */
const cleanupUploadedFiles = async (req: Request, res: Response, next: NextFunction) => {
  // Store the original res.send and res.json to intercept them
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  // Flag to ensure cleanup happens only once
  let cleanupDone = false;

  const cleanup = async () => {
    if (cleanupDone) return;
    cleanupDone = true;

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) return;

    try {
      await Promise.all(
        files.map(async (file) => {
          try {
            await fsExtra.remove(file.path);
            console.log(`Cleaned up temp file: ${file.path}`);
          } catch (err) {
            console.error(`Failed to cleanup file ${file.path}:`, err);
          }
        })
      );
    } catch (error) {
      console.error("Error during file cleanup:", error);
    }
  };

  // Intercept response methods
  res.send = function (data: any) {
    cleanup().finally(() => originalSend(data));
    return res;
  };

  res.json = function (data: any) {
    cleanup().finally(() => originalJson(data));
    return res;
  };

  // Also cleanup on error
  res.on("finish", cleanup);
  res.on("close", cleanup);

  next();
};

export default cleanupUploadedFiles;