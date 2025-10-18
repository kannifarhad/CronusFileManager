import { NextFunction, Request, Response } from "express";
import { FileManagerFactory } from "..";
import { RequestContext, StorageProvider } from "../types";
import { AsyncContext } from "./context";

export const contextMiddleware = (factory: FileManagerFactory) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const storageType = (req.headers["x-storage-type"] as StorageProvider) || factory["defaultProvider"];

    // Validate provider exists
    if (!factory.hasProvider(storageType)) {
      return next(new Error(`Storage provider '${storageType}' is not configured`));
    }

    const context: RequestContext = {
      storageProvider: storageType,
    };

    AsyncContext.run(context, () => {
      next();
    });
  };
};

export default contextMiddleware;
