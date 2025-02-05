import { EmailMessage } from '../../types/Email';
import { PrettifyEmail } from '../PrettifyEmail';

type ForgotPasswordPayload = {
  email: string;
  token: string;
  expiresIn: Date;
};

export class ForgotPasswordEmail implements EmailMessage {
  constructor(private payload: ForgotPasswordPayload) {}

  getMessage = () => {
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${this.payload.token}`;
    const message = `Your password reset link is: ${PrettifyEmail.insertLink(resetPasswordUrl)}${
      PrettifyEmail.tabSpace
    }This link will expire in ${this.payload.expiresIn.getHours()} hours. If you did not request this, please ignore this email and your password will remain unchanged.`;
    return PrettifyEmail.template(this.getSubject(), message);
  };

  getRecipients = () => this.payload.email;

  getSubject = () => {
    return 'Instructions to reset your password';
  };
}
