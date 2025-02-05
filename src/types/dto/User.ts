import { UserType } from '../enums/User';

export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserPayload = {
  username?: string;
  phone?: string;
  photo?: string;
  otp?: {
    code: string;
    issuedAt: Date;
    verifiedAt?: Date;
    otpType: string;
  };
};

export type FindUserParams = {
  userType?: UserType;
  search?: string;
  page: number;
  limit: number;
};

export type CountUserParams = Omit<FindUserParams, 'page' | 'limit'>;
