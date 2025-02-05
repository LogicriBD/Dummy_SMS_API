import { StatusCodes } from 'http-status-codes';
import { AuthRepository } from '../../database/repository/AuthRepository';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { TokenType } from '../../types/enums/AuthToken';
import { ApiError } from '../../utils/ApiError';
import { EmailVerificationRequestBody } from '../../validation/rest-api/auth/EmailVerificationRequest';
import { OTPTypes } from '../../types/enums/User';

export class EmailVerificationAction implements Action {
  constructor(private payload: EmailVerificationRequestBody) {}

  public async execute() {
    const authToken = await AuthRepository.findByTokenAndTokenType(this.payload.token, TokenType.VERIFY_EMAIL);
    const user = await UserRepository.findById(authToken.user._id.toString());
    if (user.verified) {
      return {
        message: 'Email already verified',
      };
    }
    if (user.otp && user.otp.verifiedAt && user.otp.otpType === OTPTypes.EMAIL) {
      return {
        message: 'OTP already verified',
      };
    }
    user.verified = await this.verifyOTP(this.payload.otp, String(user._id));
    if (!user.verified) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP verification failed');
    }
    if (user.otp) {
      user.otp.verifiedAt = new Date();
    }
    await UserRepository.updateById(String(user._id), user);
    await AuthRepository.deleteManyByUserIdAndToken({
      userId: String(user._id),
      token: this.payload.token,
    });
    return {
      message: 'Email verified successfully',
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
    if (user.otp.otpType !== OTPTypes.EMAIL) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP Type');
    }
    if (user.otp.code !== otp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }
    return true;
  }
}
