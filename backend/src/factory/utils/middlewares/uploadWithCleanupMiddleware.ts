import { StorageTypeContext } from "../storageTypeContext";
import fsExtra from "fs-extra";
import { Request, Response, NextFunction, Router } from "express";
import multer from "multer";

const createMulterUploader = (tmpFolder: string) => {
  const safeStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        // Ensure directory exists before multer writes to it
        await fsExtra.ensureDir(tmpFolder);
        cb(null, tmpFolder);
      } catch (error) {
        cb(error as Error, tmpFolder);
      }
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

  const upload = multer({
    storage: safeStorage, // Use custom storage instead of dest
    limits: {
      files: Number(process.env.MAX_UPLOAD_FILE_AMOUNT) || 10,
      fieldSize: Number(process.env.MAX_UPLOAD_FILE_SIZE) || 10485760, // 10MB default
    },
    // @ts-expect-error: multer typings do not include onError, handled in controller
    onError: function (err: Error, next: (err?: Error) => void) {
      return next(new Error(`Error while uploading: ${err?.message}`));
    },
  });

  return upload;
};

export function uploadAndCleanup(tmpFolder: string) {
  const upload = createMulterUploader(tmpFolder).any();

  return async (req: Request, res: Response, next: NextFunction) => {
    const provider = StorageTypeContext.getStorageProvider()!;
    const currentContext = { storageProvider: provider };
    // Run Multer inside async context
    StorageTypeContext.run(currentContext, () => {
      upload(req, res, async (err: any) => {
        if (err) return next(err);

        // Cleanup function
        const cleanup = async () => {
          const files = req.files as Express.Multer.File[] | undefined;
          if (!files || files.length === 0) return;

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
        };

        // Intercept response finish/close/send/json
        const originalSend = res.send.bind(res);
        const originalJson = res.json.bind(res);

        res.send = function (data: any) {
          cleanup().finally(() => originalSend(data));
          return res;
        };

        res.json = function (data: any) {
          cleanup().finally(() => originalJson(data));
          return res;
        };

        res.on("finish", cleanup);
        res.on("close", cleanup);

        // Continue to controller
        StorageTypeContext.run(currentContext!, () => next());
      });
    });
  };
}
