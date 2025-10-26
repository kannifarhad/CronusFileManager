import { AsyncContext } from "../../sdk/helpers/context";
import { createMulterUploader } from "../../utilits/createMulterUploader";
import fsExtra from "fs-extra";
import { Request, Response, NextFunction, Router } from "express";

export function uploadAndCleanup(tmpFolder: string) {
  const upload = createMulterUploader(tmpFolder).any();

  return async (req: Request, res: Response, next: NextFunction) => {
    const provider = AsyncContext.getStorageProvider()!;
    const currentContext = { storageProvider: provider };
    // Run Multer inside async context
    AsyncContext.run(currentContext, () => {
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
        AsyncContext.run(currentContext!, () => next());
      });
    });
  };
}
