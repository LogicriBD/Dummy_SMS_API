import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { ApiError } from '../../utils/ApiError';
import { LoginRequestBody } from '../../validation/auth/LoginRequest';
import bcrypt from 'bcrypt';
import { AuthManager } from '../../utils/AuthManager';
import { TokenType } from '../../types/enums/AuthToken';
import { omit } from 'lodash';
import { filterUser } from '../../utils/Helper';

export class LoginAction implements Action {
  constructor(private payload: LoginRequestBody) {}

  public async execute() {
    const user = await UserRepository.findByEmail(this.payload.username);

    const hashedPassword = user.password;
    const passwordMatch = await bcrypt.compare(this.payload.password, hashedPassword);
    if (!passwordMatch) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid password');
    }

    if (!user.active) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account has been deactivated. Please contact support for more information.',
      );
    }

    if (user.lock) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Your account has been locked. Please contact support for more information.',
      );
    }

    if (user.verified) {
      const authTokens = await AuthManager.generateAuthTokens(String(user._id));
      return {
        user: filterUser(user),
        ...authTokens,
      };
    } else {
      const token = await AuthManager.generateToken(String(user._id), TokenType.VERIFY_EMAIL);
      if (!token) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Token generation failed');
      }
      return {
        user: filterUser(user),
        verifyEmailToken: token,
      };
    }
  }
}
