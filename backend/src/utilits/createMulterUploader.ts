import multer from "multer";
import fsExtra from "fs-extra";
import AppError from "./appError";

export function createMulterUploader(tmpFolder: string) {
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
      return next(new AppError(`Error while uploading: ${err?.message}`, 400));
    },
  });

  return upload;
}
