import supertest from 'supertest';
import { HttpServer } from '../src/provider/HttpServer';
import { UserType } from '../src/types/enums/User';
import { UserRepository } from '../src/database/repository/UserRepository';
import { AuthManager } from '../src/utils/AuthManager';

type LoginCredential = { email: string; password: string };

export const DEFAULT_PASSWORD = '12345678';
export const credentials: Record<UserType, LoginCredential> = {
  [UserType.ADMIN]: { email: 'admin@errum.com', password: DEFAULT_PASSWORD },
  [UserType.SYSTEM_ADMIN]: { email: process.env.SUDO_EMAIL!, password: process.env.SUDO_PASSWORD! },
  [UserType.CUSTOMER]: { email: 'mirzaazwad8@gmail.com', password: DEFAULT_PASSWORD },
  [UserType.EMPLOYEE]: { email: 'mirzaazwad@iut-dhaka.edu', password: DEFAULT_PASSWORD },
};

const getWebLoginResponse = async (credential: LoginCredential) => {
  return await supertest(HttpServer).post('/auth/login').send(credential);
};

export const getAuthTokenFor = async (type: UserType) => {
  let res: any = null;
  const credential = credentials[type];
  res = await getWebLoginResponse(credential);

  if (res?.statusCode !== 200) {
    throw new Error(res.body.message);
  }

  const token = res.body.access.token;
  return `Bearer ${token}`;
};

export const getAuthTokenForSpecificUser = async (email: string) => {
  const user = await UserRepository.findByEmail(email);
  const tokens = await AuthManager.generateAuthTokens(user.id);
  return `Bearer ${tokens.access?.token}`;
};
