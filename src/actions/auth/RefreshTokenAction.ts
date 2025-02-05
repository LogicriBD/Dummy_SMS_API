import { AuthRepository } from '../../database/repository/AuthRepository';
import { Action } from '../../types/Action';
import { TokenType } from '../../types/enums/AuthToken';
import { AuthManager } from '../../utils/AuthManager';
import { AuthTokenRefreshRequestBody } from '../../validation/auth/AuthTokenRefreshRequest';

export class RefreshTokenAction implements Action {
  constructor(private payload: AuthTokenRefreshRequestBody) {}

  public async execute() {
    const authToken = await AuthRepository.findByTokenAndTokenType(this.payload.refreshToken, TokenType.REFRESH);
    if (!authToken) {
      throw new Error('Invalid refresh token');
    }
    const user = authToken.user;
    console.log(authToken);
    const accessToken = await AuthManager.generateToken(authToken.user._id.toString(), TokenType.ACCESS);
    if (!accessToken) {
      throw new Error('Token generation failed');
    }
    return {
      accessToken,
    };
  }
}
