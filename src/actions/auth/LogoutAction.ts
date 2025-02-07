import { StatusCodes } from 'http-status-codes';
import { AuthRepository } from '../../database/repository/AuthRepository';
import { Action } from '../../types/Action';
import { ApiError } from '../../utils/ApiError';

export class LogoutAction implements Action {
  constructor(private currentUser: Express.User) {}

  public async execute() {
    const logout = await AuthRepository.deleteManyByUserId(this.currentUser.id);
    if (logout.deletedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid refresh token');
    }
    return {
      message: 'Logout successful',
    };
  }
}
