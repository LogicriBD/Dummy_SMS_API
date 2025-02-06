import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError';
import { ExpressRouter } from '../utils/misc/ExpressRouter';

export const notFoundRoute = async (req: Request, res: Response, next: NextFunction) => {
  const currentPath = req.path;
  const paths = ExpressRouter.getRoutes();
  for (const path of paths)
  {
    if (currentPath.includes(path))
    {
      return next();
    }
  }
  next(new ApiError(StatusCodes.NOT_FOUND, `The requested API ${req.path} was not found for method ${req.method}`));
};
