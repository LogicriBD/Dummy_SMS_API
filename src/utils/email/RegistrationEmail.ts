import { EmailMessage } from '../../types/Email';
import { PrettifyEmail } from '../PrettifyEmail';

type ForgotPasswordPayload = {
  email: string;
  token: string;
  otp: string;
  expiresIn: Date;
};

export class RegistrationEmail implements EmailMessage {
  constructor(private payload: ForgotPasswordPayload) {}

  getMessage = () => {
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/verify-email?token=${this.payload.token}`;
    const message = `Your email verification link is: ${PrettifyEmail.insertLink(resetPasswordUrl)}${
      PrettifyEmail.tabSpace
    }This link will expire in ${this.payload.expiresIn.getHours()} hours. If you did not request this, please ignore this email and your password will remain unchanged. ${PrettifyEmail.linebreak}
      Enter the following otp in the link given above to verify your email:${PrettifyEmail.linebreak} ${PrettifyEmail.otp(this.payload.otp)}`;
    return PrettifyEmail.template(this.getSubject(), message);
  };

  getRecipients = () => this.payload.email;

  getSubject = () => {
    return 'Please Verify Your Email';
  };
}
