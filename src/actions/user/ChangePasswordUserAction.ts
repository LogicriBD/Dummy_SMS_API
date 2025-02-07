import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { ApiError } from '../../utils/ApiError';
import { filterUser } from '../../utils/Helper';
import { ChangePasswordRequestBody } from '../../validation/user/UpdatePasswordRequest';
import bcrypt from 'bcrypt';

export class ChangePasswordUserAction implements Action {
  constructor(
    private payload: ChangePasswordRequestBody,
    private currentUser: Express.User,
  ) {}

  public async execute() {
    const user = await UserRepository.findById(this.currentUser.id);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    const isPasswordMatch = await bcrypt.compare(this.payload.oldPassword, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Old password is incorrect');
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_SIZE!));
    const password = await bcrypt.hash(this.payload.newPassword, salt);
    const updatedUser = await UserRepository.updateById(this.currentUser.id, {
      password,
    });
    return {
      user: filterUser(updatedUser),
    };
  }
}
