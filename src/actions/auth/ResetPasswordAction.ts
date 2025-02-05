import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { AuthManager } from '../../utils/AuthManager';
import { ResetPasswordRequestBody } from '../../validation/auth/ResetPasswordRequest';
import bcrypt from 'bcrypt';

export class ResetPasswordAction implements Action {
  constructor(private payload: ResetPasswordRequestBody) {}

  public async execute() {
    const verifiedToken = await AuthManager.verifyToken(this.payload.token);
    if (!verifiedToken) {
      throw new Error('Invalid token');
    }
    const user = await UserRepository.findById(verifiedToken.userId);
    const salt = await bcrypt.genSalt(Number(process.env.SALT_SIZE!));
    const hashedPassword = await bcrypt.hash(this.payload.password, salt);
    user.password = hashedPassword;
    await UserRepository.updateById(verifiedToken.userId, user);
    return {
      message: 'Password reset successfully',
    };
  }
}
