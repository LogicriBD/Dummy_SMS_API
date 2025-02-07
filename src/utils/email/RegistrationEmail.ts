import { EmailMessage } from '../../types/Email';
import { PrettifyEmail } from '../PrettifyEmail';

type RegistrationEmailPayload = {
  email: string;
  otp: string;
  expiresIn: Date;
};

export class RegistrationEmail implements EmailMessage {
  constructor(private payload: RegistrationEmailPayload) {}

  getMessage = () => {
    const message = `Please verify your email ${PrettifyEmail.linebreak}
      Enter the following otp to verify your email:${PrettifyEmail.linebreak} ${PrettifyEmail.otp(this.payload.otp)}
      ${PrettifyEmail.linebreak}This OTP will expire in ${this.payload.expiresIn}
      `;
    return PrettifyEmail.template(this.getSubject(), message);
  };

  getRecipients = () => this.payload.email;

  getSubject = () => {
    return 'Please Verify Your Email';
  };
}
