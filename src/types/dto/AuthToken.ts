import { TokenType } from '../enums/AuthToken';
import { Schema } from 'mongoose';

export type CreateAuthTokenPayload = {
  user: {
    _id: Schema.Types.ObjectId;
    email: string;
    username: string;
  };
  token: string;
  type: TokenType;
  expires: Date;
};

export type UpdateAuthTokenPayload = Partial<CreateAuthTokenPayload>;
