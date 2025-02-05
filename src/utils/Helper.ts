import { random } from 'lodash';

import * as fs from 'fs';
import path from 'path';
import { logger } from '../provider/LogDriver';
import { Types } from 'mongoose';
import { UserProps } from '../database/model/User';

export const makeOTPCode = () => `${random(100000, 999999)}`;
export const toMongoID = (id: string | unknown) => new Types.ObjectId(id as string);

export type LogLevel = 'info' | 'error' | 'warn' | 'debug';
export const log = (level: LogLevel, message: string, meta: any = undefined) => {
  logger.log(level, message, meta);
};

export function isDevelopmentEnvironment() {
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'uat') {
    return true;
  } else {
    return false;
  }
}

export const filterUser = (user: UserProps & { _id: any }) => {
  const filteredUser: Partial<UserProps & { status: string }> & { _id: any } = {
    _id: user._id,
    email: user.email,
    username: user.username,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  if (user.lock?.isLocked) {
    filteredUser.status = 'locked';
  }
  if (!user.active) {
    filteredUser.status = 'deactivated';
  }
  if (!user.verified) {
    filteredUser.status = 'unverified';
  } else {
    filteredUser.status = 'active';
  }
  return filteredUser;
};

export const toResizedPhoneNumber = (phone: string | number, targetLength = 11) => {
  try {
    const meaningfulPart = `${phone}`.slice(-10);
    const fullForm = '+880' + meaningfulPart;
    return fullForm.slice(-targetLength);
  } catch (err) {
    console.log(`error in phone number resize: ${phone}`);
    return '';
  }
};

export const toFlattenedString = (payload: any) => {
  if (!(typeof payload === 'object')) {
    throw Error(`Cannot render as error message for ${payload}`);
  }
  let errorMessage = '';
  for (const [key, value] of Object.entries(payload)) {
    errorMessage += `${key}: ${value}`;
  }
  return errorMessage;
};

export const getLocalUploadDirPathFor = (fileName: string) => path.resolve(__dirname, '../../upload/', fileName);

export const getLocalFileSizeInBytes = async (filePath: string): Promise<number> => (await fs.promises.stat(filePath)).size;
