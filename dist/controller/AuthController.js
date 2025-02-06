"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const Controller_1 = require("../types/Controller");
const LoginRequest_1 = require("../validation/auth/LoginRequest");
const EmailVerificationAction_1 = require("../actions/auth/EmailVerificationAction");
const LoginAction_1 = require("../actions/auth/LoginAction");
const LogoutAction_1 = require("../actions/auth/LogoutAction");
const RefreshTokenAction_1 = require("../actions/auth/RefreshTokenAction");
const ForgotPasswordAction_1 = require("../actions/auth/ForgotPasswordAction");
const ResetPasswordAction_1 = require("../actions/auth/ResetPasswordAction");
const ResetPasswordVerificationAction_1 = require("../actions/auth/ResetPasswordVerificationAction");
const LogoutRequest_1 = require("../validation/auth/LogoutRequest");
const AuthTokenRefreshRequest_1 = require("../validation/auth/AuthTokenRefreshRequest");
const ForgotPasswordRequest_1 = require("../validation/auth/ForgotPasswordRequest");
const ResetPasswordRequest_1 = require("../validation/auth/ResetPasswordRequest");
const ResetPasswordVerificationRequest_1 = require("../validation/auth/ResetPasswordVerificationRequest");
const EmailVerificationRequest_1 = require("../validation/auth/EmailVerificationRequest");
const RegistrationRequest_1 = require("../validation/auth/RegistrationRequest");
const RegistrationAction_1 = require("../actions/auth/RegistrationAction");
let AuthController = class AuthController {
    async login(req, res, next) {
        try {
            const loginAction = new LoginAction_1.LoginAction(req.body);
            const response = await loginAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const loginAction = new RegistrationAction_1.RegistrationAction(req.body);
            const response = await loginAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const logoutAction = new LogoutAction_1.LogoutAction(req.body, req.user);
            const response = await logoutAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const refreshTokenAction = new RefreshTokenAction_1.RefreshTokenAction(req.body);
            const response = await refreshTokenAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const forgotPasswordAction = new ForgotPasswordAction_1.ForgotPasswordAction(req.body);
            const response = await forgotPasswordAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const resetPasswordAction = new ResetPasswordAction_1.ResetPasswordAction(req.body);
            const response = await resetPasswordAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async resetPasswordVerification(req, res, next) {
        try {
            const resetPasswordVerificationAction = new ResetPasswordVerificationAction_1.ResetPasswordVerificationAction(req.body);
            const response = await resetPasswordVerificationAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async phoneVerification(req, res, next) {
        try {
            const emailVerificationAction = new EmailVerificationAction_1.EmailVerificationAction(req.body);
            const response = await emailVerificationAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, Controller_1.POST)('/login', [LoginRequest_1.loginValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, Controller_1.POST)('/register', [RegistrationRequest_1.registrationValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, Controller_1.POST)('/logout', [LogoutRequest_1.logoutValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, Controller_1.POST)('/refresh-token', [AuthTokenRefreshRequest_1.authTokenRefreshValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, Controller_1.POST)('/forgot-password', [ForgotPasswordRequest_1.forgotPasswordValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, Controller_1.POST)('/reset-password', [ResetPasswordRequest_1.resetPasswordValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, Controller_1.POST)('/reset-password-verification', [ResetPasswordVerificationRequest_1.resetPasswordVerificationValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPasswordVerification", null);
__decorate([
    (0, Controller_1.POST)('/email-verification', [EmailVerificationRequest_1.emailVerificationValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "phoneVerification", null);
exports.AuthController = AuthController = __decorate([
    Controller_1.Controller
], AuthController);
//# sourceMappingURL=AuthController.js.map