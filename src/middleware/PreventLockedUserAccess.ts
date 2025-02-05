import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError';
import { ExpressRouter } from '../utils/misc/ExpressRouter';

export const preventLockedUserAccess = (req: Request, res: Response, next: NextFunction) => {
  if (ExpressRouter.isPublicRoute(req.path)) {
    next();
  } else {
    const user = req.user;
    if (!user) {
      next(new ApiError(StatusCodes.PRECONDITION_FAILED, 'Unauthenticated access.'));
    } else if (user.lock?.isLocked) {
      const lockedMessage = user.lock.feedback || 'Your account is locked. Please contact support for assistance.';
      next(new ApiError(StatusCodes.PRECONDITION_FAILED, lockedMessage));
    } else {
      next();
    }
  }
};
