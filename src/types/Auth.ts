export type TokenData = {
  token: string;
  expiresAt: Date;
};

export type AuthenticationResponse = {
  user: Express.User;
  access: TokenData;
  refresh: TokenData;
};

export interface IJwtToken {
  id: string;
  userId: string;
  type: string;
  iat: number;
  exp: number;
}
