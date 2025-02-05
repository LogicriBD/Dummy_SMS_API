import { NextFunction, Request, Response } from 'express';
import { Controller, POST } from '../types/Controller';
import { LoginRequestBody, loginValidator } from '../validation/auth/LoginRequest';
import { EmailVerificationAction } from '../actions/auth/EmailVerificationAction';
import { LoginAction } from '../actions/auth/LoginAction';
import { LogoutAction } from '../actions/auth/LogoutAction';
import { RefreshTokenAction } from '../actions/auth/RefreshTokenAction';
import { ForgotPasswordAction } from '../actions/auth/ForgotPasswordAction';
import { ResetPasswordAction } from '../actions/auth/ResetPasswordAction';
import { ResetPasswordVerificationAction } from '../actions/auth/ResetPasswordVerificationAction';
import { logoutValidator } from '../validation/auth/LogoutRequest';
import { authTokenRefreshValidator } from '../validation/auth/AuthTokenRefreshRequest';
import { forgotPasswordValidator } from '../validation/auth/ForgotPasswordRequest';
import { resetPasswordValidator } from '../validation/auth/ResetPasswordRequest';
import { resetPasswordVerificationValidator } from '../validation/auth/ResetPasswordVerificationRequest';
import { emailVerificationValidator } from '../validation/auth/EmailVerificationRequest';
import { RegistrationRequestBody, registrationValidator } from '../validation/auth/RegistrationRequest';
import { RegistrationAction } from '../actions/auth/RegistrationAction';

@Controller
export class AuthController {
  @POST('/login', [loginValidator])
  public async login(req: Request<unknown, unknown, LoginRequestBody, unknown>, res: Response, next: NextFunction) {
    try {
      const loginAction = new LoginAction(req.body);
      const response = await loginAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/register', [registrationValidator])
  public async register(
    req: Request<unknown, unknown, RegistrationRequestBody, unknown>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const loginAction = new RegistrationAction(req.body);
      const response = await loginAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/logout', [logoutValidator])
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const logoutAction = new LogoutAction(req.body, req.user!);
      const response = await logoutAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/refresh-token', [authTokenRefreshValidator])
  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenAction = new RefreshTokenAction(req.body);
      const response = await refreshTokenAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/forgot-password', [forgotPasswordValidator])
  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const forgotPasswordAction = new ForgotPasswordAction(req.body);
      const response = await forgotPasswordAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/reset-password', [resetPasswordValidator])
  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const resetPasswordAction = new ResetPasswordAction(req.body);
      const response = await resetPasswordAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/reset-password-verification', [resetPasswordVerificationValidator])
  public async resetPasswordVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const resetPasswordVerificationAction = new ResetPasswordVerificationAction(req.body);
      const response = await resetPasswordVerificationAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/email-verification', [emailVerificationValidator])
  public async phoneVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const emailVerificationAction = new EmailVerificationAction(req.body);
      const response = await emailVerificationAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
