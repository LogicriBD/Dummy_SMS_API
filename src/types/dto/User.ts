export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  verified?: boolean;
};

export type UpdateUserPayload = {
  username?: string;
  phone?: string[];
  otp?: {
    code: string;
    issuedAt: Date;
    verifiedAt?: Date;
    otpType: string;
  };
};

export type FindUserParams = {
  search?: string;
  page: number;
  limit: number;
};

export type CountUserParams = Omit<FindUserParams, 'page' | 'limit'>;
