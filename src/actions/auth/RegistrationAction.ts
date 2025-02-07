import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { TokenType } from '../../types/enums/AuthToken';
import { ApiError } from '../../utils/ApiError';
import { AuthManager } from '../../utils/AuthManager';
import { RegistrationRequestBody } from '../../validation/auth/RegistrationRequest';
import bcrypt from 'bcrypt';
import { makeOTPCode } from '../../utils/Helper';
import { OTPTypes } from '../../types/enums/User';
import { RegistrationEmail } from '../../utils/email/RegistrationEmail';
import { EmailService } from '../../provider/EmailService';

export class RegistrationAction implements Action {
  constructor(private payload: RegistrationRequestBody) {}

  public async execute() {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_SIZE!));
    const password = await bcrypt.hash(this.payload.password, salt);
    this.payload.password = password;
    const otpCode = makeOTPCode();
    const user = await UserRepository.create(this.payload);
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User creation failed');
    }
    const otp = {
      code: otpCode,
      issuedAt: new Date(),
      otpType: OTPTypes.EMAIL,
    };
    await UserRepository.updateById(String(user._id), {
      otp,
    });
    const token = await AuthManager.generateToken(String(user._id), TokenType.VERIFY_EMAIL);
    if (!token) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Token generation failed');
    }
    const registrationEmail = new RegistrationEmail({
      email: this.payload.email,
      expiresIn: token.expires,
      otp: otpCode,
    });
    await EmailService.sendEmail(registrationEmail);
    return {
      verifyEmailToken: token,
    };
  }
}
