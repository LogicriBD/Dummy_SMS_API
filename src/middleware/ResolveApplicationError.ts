import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/ApiError'
import { log } from '../utils/Helper'

export const resolveApplicationError = async (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  if (err instanceof ApiError) {
    statusCode = err.statusCode
  }

  let message: string = err.message
  let isOperational = false
  const isAppInProductionMode = process.env.NODE_ENV === 'prod'
  const isAppInDevelopmentMode = process.env.NODE_ENV === 'dev'

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(isAppInDevelopmentMode && { stack: err.stack }),
  }

  if (statusCode != StatusCodes.UNAUTHORIZED) {
    log('error', err.toString(), err)
  }

  res.status(statusCode).send(response)
}
