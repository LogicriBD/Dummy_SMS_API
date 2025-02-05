import { z } from 'zod';
import { elevenDigitPhoneNumberSchema, maskingSchema } from '../../utils/Validation';
import { allMessageTypes } from '../../database/model/SMS';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';
import { UserRepository } from '../../database/repository/UserRepository';
import bcrypt from 'bcrypt';

export const smsSchema = z.object({
  userName: z.string().min(1),
  password: z.string().min(1),
  receiver: elevenDigitPhoneNumberSchema,
  message: z.string().min(1),
  masking: maskingSchema,
  MsgType: z.enum(allMessageTypes),
});

export type SMSRequestParams = z.infer<typeof smsSchema>;
export type SMSRequestBody = SMSRequestParams;

export const multimediaSMSRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body.userName;
    const password = req.body.password;
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials, user not found for given username');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials, password does not match');
    }
    if (!req.body.receiver) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Receiver is required');
    }
    const isReceiverValid = user.phone.includes(req.body.receiver);
    if (!isReceiverValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid receiver, receiver not found for given username');
    }
    return validateRequestPayload(smsSchema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const textSMSRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.params;
    if (!payload) {
      next();
      return;
    }
    const username = req.params.userName;
    const password = req.params.password;
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials, user not found for given username');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials, password does not match');
    }
    if (!req.params.receiver) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Receiver is required');
    }
    const isReceiverValid = user.phone.includes(req.params.receiver);
    if (!isReceiverValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid receiver, receiver not found for given username');
    }

    const result = smsSchema.safeParse(payload);
    if (result.success) {
      req.params = result.data;
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
  } catch (error) {
    next(error);
  }
};
