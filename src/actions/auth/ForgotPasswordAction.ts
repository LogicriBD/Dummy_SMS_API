import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { TokenType } from '../../types/enums/AuthToken';
import { ApiError } from '../../utils/ApiError';
import { AuthManager } from '../../utils/AuthManager';
import { ForgotPasswordRequestBody } from '../../validation/auth/ForgotPasswordRequest';
import { ForgotPasswordEmail } from '../../utils/email/ForgotPasswordEmail';
import { EmailService } from '../../provider/EmailService';
import { makeOTPCode } from '../../utils/Helper';
import { OTPTypes } from '../../types/enums/User';

export class ForgotPasswordAction implements Action {
  constructor(private payload: ForgotPasswordRequestBody) {}

  public async execute() {
    const user = await UserRepository.findByEmail(this.payload.email);
    if (!user.active || user.lock) {
      return {
        message: 'User is not active or locked',
      };
    }
    const resetPasswordToken = await AuthManager.generateToken(String(user._id), TokenType.RESET_LINK);

    if (!resetPasswordToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Token generation failed');
    }
    const otpCode = makeOTPCode();
    const otp = {
      code: otpCode,
      issuedAt: new Date(),
      otpType: OTPTypes.FORGOT_PASSWORD,
    };
    await UserRepository.updateById(String(user._id), {
      otp,
    });
    const forgotPasswordEmail = new ForgotPasswordEmail({
      email: this.payload.email,
      token: resetPasswordToken.token,
      expiresIn: resetPasswordToken.expires,
    });

    const emailSent = await EmailService.sendEmail(forgotPasswordEmail);
    if (!emailSent) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email sending failed');
    }

    return {
      message: 'Password reset link sent to your email',
    };
  }
}
