import { NextFunction, Request, Response } from 'express';
import { errorResponseFormat, Morgan, successResponseFormat } from '../utils/Morgan';
import { log } from '../utils/Helper';

const successHandler = Morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: {
    write: (message: string) => {
      log('info', message.trim());
    },
  },
});

const errorHandler = Morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: {
    write: (message: string) => {
      log('error', message.trim());
    },
  },
});

export const loggingMiddleware = (request: Request, response: Response, next: NextFunction) => {
  successHandler(request, response, () => {
    errorHandler(request, response, next);
  });
};
