"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationAction = void 0;
const http_status_codes_1 = require("http-status-codes");
const AuthRepository_1 = require("../../database/repository/AuthRepository");
const UserRepository_1 = require("../../database/repository/UserRepository");
const AuthToken_1 = require("../../types/enums/AuthToken");
const ApiError_1 = require("../../utils/ApiError");
const User_1 = require("../../types/enums/User");
class EmailVerificationAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const authToken = await AuthRepository_1.AuthRepository.findByTokenAndTokenType(this.payload.token, AuthToken_1.TokenType.VERIFY_EMAIL);
        const user = await UserRepository_1.UserRepository.findById(authToken.user._id.toString());
        if (user.verified) {
            return {
                message: 'Email already verified',
            };
        }
        if (user.otp && user.otp.verifiedAt && user.otp.otpType === User_1.OTPTypes.EMAIL) {
            return {
                message: 'OTP already verified',
            };
        }
        user.verified = await this.verifyOTP(this.payload.otp, String(user._id));
        if (!user.verified) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP verification failed');
        }
        if (user.otp) {
            user.otp.verifiedAt = new Date();
        }
        await UserRepository_1.UserRepository.updateById(String(user._id), user);
        await AuthRepository_1.AuthRepository.deleteManyByUserIdAndToken({
            userId: String(user._id),
            token: this.payload.token,
        });
        return {
            message: 'Email verified successfully',
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
        if (user.otp.otpType !== User_1.OTPTypes.EMAIL) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP Type');
        }
        if (user.otp.code !== otp) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP');
        }
        return true;
    }
}
exports.EmailVerificationAction = EmailVerificationAction;
//# sourceMappingURL=EmailVerificationAction.js.map