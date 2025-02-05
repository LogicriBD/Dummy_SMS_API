import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { TokenType } from '../../types/enums/AuthToken';
import { ApiError } from '../../utils/ApiError';
import { AuthManager } from '../../utils/AuthManager';
import { ResetPasswordVerificationRequestBody } from '../../validation/rest-api/auth/ResetPasswordVerificationRequest';
import { OTPTypes } from '../../types/enums/User';

export class ResetPasswordVerificationAction implements Action {
  constructor(private payload: ResetPasswordVerificationRequestBody) {}

  public async execute() {
    const verifiedToken = await AuthManager.verifyToken(this.payload.token);
    if (!verifiedToken) {
      throw new Error('Invalid token');
    }
    const user = await UserRepository.findById(verifiedToken.userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.otp && user.otp.verifiedAt && user.otp.otpType === OTPTypes.FORGOT_PASSWORD) {
      return {
        message: 'OTP already verified',
      };
    }
    const verified = await this.verifyOTP(this.payload.otp, verifiedToken.userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (!verified) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP verification failed');
    }
    if (user.otp) {
      user.otp.verifiedAt = new Date();
    }
    await UserRepository.updateById(verifiedToken.userId, user);
    const resetPasswordToken = await AuthManager.generateToken(verifiedToken.userId, TokenType.RESET_PASSWORD);
    if (!resetPasswordToken) {
      throw new Error('Token generation failed');
    }
    return {
      message: 'Reset Password Email Verified Successfully',
      ...resetPasswordToken,
    };
  }

  async verifyOTP(otp: string, userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.otp) {
      throw new Error('OTP not found');
    }
    if (process.env.NODE_ENV === 'development' && otp === '123456') {
      return true;
    }
    if (user.otp.otpType !== OTPTypes.FORGOT_PASSWORD) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP Type');
    }
    if (user.otp.code !== otp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }
    return true;
  }
}
