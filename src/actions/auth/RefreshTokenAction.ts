import { StatusCodes } from 'http-status-codes';
import { AuthRepository } from '../../database/repository/AuthRepository';
import { Action } from '../../types/Action';
import { TokenType } from '../../types/enums/AuthToken';
import { ApiError } from '../../utils/ApiError';
import { AuthManager } from '../../utils/AuthManager';
import { AuthTokenRefreshRequestBody } from '../../validation/auth/AuthTokenRefreshRequest';

export class RefreshTokenAction implements Action {
  constructor(private payload: AuthTokenRefreshRequestBody) {}

  public async execute() {
    const authToken = await AuthRepository.findByTokenAndTokenType(this.payload.refreshToken, TokenType.REFRESH);
    if (!authToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid refresh token');
    }
    const accessToken = await AuthManager.generateToken(authToken.user._id.toString(), TokenType.ACCESS);
    if (!accessToken) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Token generation failed');
    }
    return {
      accessToken,
    };
  }
}
