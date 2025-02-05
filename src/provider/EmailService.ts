import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import { EmailMessage } from "../types/Email";
import { EmailProvider } from "../types/EmailProvider";
import { ApiError } from "../utils/ApiError";

class EmailServiceImpl implements EmailProvider {
  private static instance: EmailServiceImpl;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT!,
      secure: process.env.SMTP_TLS === "true",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  public static getInstance(): EmailServiceImpl {
    if (!EmailServiceImpl.instance) {
      EmailServiceImpl.instance = new EmailServiceImpl();
    }

    return EmailServiceImpl.instance;
  }

  public async sendEmail(email: EmailMessage) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email.getRecipients(),
        subject: email.getSubject(),
        html: email.getMessage(),
      };
      return await this.transporter.sendMail(mailOptions);
    } catch (err: ApiError | any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unable to send email. Please try again later."
      );
    }
  }
}

export const EmailService = EmailServiceImpl.getInstance();
