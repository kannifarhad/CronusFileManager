/**
 * @package     Cronus File Manager
 * author       Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import { Request, Response, NextFunction } from "express";
import AppError from "../../utilits/appError";

/**
 * Wraps an async Express route handler and forwards rejected promises to next().
 */
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((error: Error) =>
      next(new AppError(`Error while executing code: ${error?.message}`, 400))
    );
  };

export default catchAsync;
