"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordAction = void 0;
const http_status_codes_1 = require("http-status-codes");
const UserRepository_1 = require("../../database/repository/UserRepository");
const AuthToken_1 = require("../../types/enums/AuthToken");
const ApiError_1 = require("../../utils/ApiError");
const AuthManager_1 = require("../../utils/AuthManager");
const ForgotPasswordEmail_1 = require("../../utils/email/ForgotPasswordEmail");
const EmailService_1 = require("../../provider/EmailService");
const Helper_1 = require("../../utils/Helper");
const User_1 = require("../../types/enums/User");
class ForgotPasswordAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const user = await UserRepository_1.UserRepository.findByEmail(this.payload.email);
        if (!user.active || user.lock) {
            return {
                message: 'User is not active or locked',
            };
        }
        const resetPasswordToken = await AuthManager_1.AuthManager.generateToken(String(user._id), AuthToken_1.TokenType.RESET_LINK);
        if (!resetPasswordToken) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token generation failed');
        }
        const otpCode = (0, Helper_1.makeOTPCode)();
        const otp = {
            code: otpCode,
            issuedAt: new Date(),
            otpType: User_1.OTPTypes.FORGOT_PASSWORD,
        };
        await UserRepository_1.UserRepository.updateById(String(user._id), {
            otp,
        });
        const forgotPasswordEmail = new ForgotPasswordEmail_1.ForgotPasswordEmail({
            email: this.payload.email,
            token: resetPasswordToken.token,
            expiresIn: resetPasswordToken.expires,
        });
        const emailSent = await EmailService_1.EmailService.sendEmail(forgotPasswordEmail);
        if (!emailSent) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email sending failed');
        }
        return {
            message: 'Password reset link sent to your email',
        };
    }
}
exports.ForgotPasswordAction = ForgotPasswordAction;
//# sourceMappingURL=ForgotPasswordAction.js.map