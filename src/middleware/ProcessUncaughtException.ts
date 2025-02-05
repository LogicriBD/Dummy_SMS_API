import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/ApiError'

export const processUncaughtException = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    const message = error.message || StatusCodes[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }

  next(error)
}
