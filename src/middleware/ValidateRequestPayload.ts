import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

export const getRequestPayload = (req: Request): any => {
  switch (req.method) {
    case 'GET':
      return req.query;

    case 'POST':
      return req.body;
    default:
      return null;
  }
};

export const validatePayloadBroker = (schema: ZodSchema) => {
  return (payload: any) => {
    const result = schema.safeParse(payload);
    if (result.success) {
      return result.data;
    }

    const messages: string[] = [];
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      const description = `${path} - ${issue.message} (${issue.code})`;
      messages.push(description);
    }

    const message = messages.length ? messages.join('. ') : 'Unknown Validation Error';
    throw new Error(`Validation Error: ${message}`);
  };
};

export const validateRequestPayload = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = getRequestPayload(req);
    if (!payload) {
      next();
      return;
    }

    const result = schema.safeParse(payload);
    if (result.success) {
      switch (req.method) {
        case 'GET':
          req.query = result.data;

        case 'POST':
          req.body = result.data;
      }
      next();
      return;
    }

    const messages: string[] = [];
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      const description = `${path} - ${issue.message} (${issue.code})`;
      messages.push(description);
    }

    const message = messages.length ? messages.join('. ') : 'Validation Error';
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message);
  };
};
