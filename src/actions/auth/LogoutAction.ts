import { StatusCodes } from 'http-status-codes';
import { AuthRepository } from '../../database/repository/AuthRepository';
import { Action } from '../../types/Action';
import { ApiError } from '../../utils/ApiError';
import { LogoutRequestBody } from '../../validation/auth/LogoutRequest';

export class LogoutAction implements Action {
  constructor(
    private payload: LogoutRequestBody,
    private currentUser: Express.User,
  ) {}

  public async execute() {
    const logout = await AuthRepository.deleteManyByUserIdAndToken({
      userId: this.currentUser.id,
      token: this.payload.refreshToken,
    });
    if (logout.deletedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid refresh token');
    }
    return {
      message: 'Logout successful',
    };
  }
}
