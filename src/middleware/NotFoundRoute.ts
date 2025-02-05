import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError';
import { ExpressRouter } from '../utils/misc/ExpressRouter';

export const notFoundRoute = async (req: Request, res: Response, next: NextFunction) => {
  const currentPath = req.path;
  if (ExpressRouter.getRoutes().includes(currentPath) || ExpressRouter.isPublicRoute(currentPath)) {
    return next();
  }
  next(new ApiError(StatusCodes.NOT_FOUND, `The requested API ${req.path} was not found for method ${req.method}`));
};
