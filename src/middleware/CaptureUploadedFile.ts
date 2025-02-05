import { randomBytes } from 'crypto'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import multer, { FileFilterCallback } from 'multer'
import { ApiError } from '../utils/ApiError'

const localFileUploadStorage = multer.diskStorage({
  destination: 'upload',
  filename(req, file, callback) {
    const extension = file.originalname.split('.').pop()
    const uuid = randomBytes(12).toString('hex')
    const fileName = `file-${uuid}.${extension}`
    callback(null, fileName)
  },
})

const createFileFilter = (allowedMimeTypes: string[]) => {
  return (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          `${file.mimetype} file type is not allowed, please upload a file of type ${allowedMimeTypes.join(', ')}`
        )
      )
    }
  }
}

export const withSingleFile = (name: string, allowedMimeTypes?: string[]) =>
  multer({
    limits: { fileSize: 500 * 1024 * 1024 },
    storage: localFileUploadStorage,
    fileFilter: allowedMimeTypes ? createFileFilter(allowedMimeTypes) : undefined,
  }).single(name)

export const withMultipleFiles = (name: string, allowedMimeTypes?: string[]) =>
  multer({
    limits: { fileSize: 500 * 1024 * 1024 },
    storage: localFileUploadStorage,
    fileFilter: allowedMimeTypes ? createFileFilter(allowedMimeTypes) : undefined,
  }).array(name)
