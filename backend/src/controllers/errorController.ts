/**
 * @package     Cronus File Manager
 * @author      Farhad Aliyev Kanni
 * @copyright   Copyright (c) 2011 - 2024, Kannifarhad, Ltd.
 * @license     https://opensource.org/licenses/GPL-3.0
 * @link        http://filemanager.kanni.pro
 */

import { Request, Response, NextFunction } from 'express';
import AppError from '../utilits/appError';

const environment = process.env.NODE_ENV || 'development';

const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: any, req: Request, res: Response) => {
  console.error('ERROR DEV 💥', err);
  res.status(err?.statusCode ?? 500).json({
    status: err?.status,
    error: err,
    message: err?.message,
    stack: err?.stack,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err?.statusCode ?? 500).json({
      status: err?.status,
      message: err?.message,
    });
  }

  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (environment === 'development') {
    sendErrorDev(err, req, res);
  } else if (environment === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;