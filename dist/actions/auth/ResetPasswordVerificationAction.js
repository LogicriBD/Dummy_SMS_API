"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordVerificationAction = void 0;
const http_status_codes_1 = require("http-status-codes");
const UserRepository_1 = require("../../database/repository/UserRepository");
const AuthToken_1 = require("../../types/enums/AuthToken");
const ApiError_1 = require("../../utils/ApiError");
const AuthManager_1 = require("../../utils/AuthManager");
const User_1 = require("../../types/enums/User");
class ResetPasswordVerificationAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const verifiedToken = await AuthManager_1.AuthManager.verifyToken(this.payload.token);
        if (!verifiedToken) {
            throw new Error('Invalid token');
        }
        const user = await UserRepository_1.UserRepository.findById(verifiedToken.userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.otp && user.otp.verifiedAt && user.otp.otpType === User_1.OTPTypes.FORGOT_PASSWORD) {
            return {
                message: 'OTP already verified',
            };
        }
        const verified = await this.verifyOTP(this.payload.otp, verifiedToken.userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!verified) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP verification failed');
        }
        if (user.otp) {
            user.otp.verifiedAt = new Date();
        }
        await UserRepository_1.UserRepository.updateById(verifiedToken.userId, user);
        const resetPasswordToken = await AuthManager_1.AuthManager.generateToken(verifiedToken.userId, AuthToken_1.TokenType.RESET_PASSWORD);
        if (!resetPasswordToken) {
            throw new Error('Token generation failed');
        }
        return {
            message: 'Reset Password Email Verified Successfully',
            ...resetPasswordToken,
        };
    }
    async verifyOTP(otp, userId) {
        const user = await UserRepository_1.UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.otp) {
            throw new Error('OTP not found');
        }
        if (process.env.NODE_ENV === 'development' && otp === '123456') {
            return true;
        }
        if (user.otp.otpType !== User_1.OTPTypes.FORGOT_PASSWORD) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP Type');
        }
        if (user.otp.code !== otp) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP');
        }
        return true;
    }
}
exports.ResetPasswordVerificationAction = ResetPasswordVerificationAction;
//# sourceMappingURL=ResetPasswordVerificationAction.js.map