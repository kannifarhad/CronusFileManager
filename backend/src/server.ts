/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import path from "path";
import AppError from "./utilits/appError";
import globalErrorHandler from "./controllers/errorController";
import { FILE_STORAGE_MAIN_FOLDER } from "./config/fileStorage";
import fileManager from './routes/fileManager';
import { getDirname } from "./utilits/filemanager";
// import bucketManager from './routes/bucketManager';

const app: Application = express();
const port = 3131;

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.set("trust proxy", 1);

// Rate limiter
const limiter = rateLimit({
  max: 1000,
  windowMs: 1 * 60 * 1000,
  message: new AppError("Too many requests from this IP, please try again in 1 minute", 429) as unknown as string, // rateLimit expects string, but we throw AppError later
});

app.use(limiter);
// Routes
app.use('/fm', fileManager);
// app.use('/s3', bucketManager);
const __dirname = getDirname(import.meta.url);
app.use(`/${FILE_STORAGE_MAIN_FOLDER}`, express.static(path.join(__dirname, FILE_STORAGE_MAIN_FOLDER)));

// 404 handler
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
