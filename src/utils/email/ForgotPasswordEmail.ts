import { EmailMessage } from '../../types/Email';
import { PrettifyEmail } from '../PrettifyEmail';

type ForgotPasswordPayload = {
  email: string;
  otp: string;
  expiresIn: Date;
};

export class ForgotPasswordEmail implements EmailMessage {
  constructor(private payload: ForgotPasswordPayload) {}

  getMessage = () => {
    const message = `Please verify your reset password request ${PrettifyEmail.linebreak}
      Enter the following otp to verify your request:${PrettifyEmail.linebreak} ${PrettifyEmail.otp(this.payload.otp)}
      ${PrettifyEmail.linebreak}This OTP will expire in ${this.payload.expiresIn}
      `;
    return PrettifyEmail.template(this.getSubject(), message);
  };

  getRecipients = () => this.payload.email;

  getSubject = () => {
    return 'Instructions to reset your password';
  };
}
