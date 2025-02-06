"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationAction = void 0;
const http_status_codes_1 = require("http-status-codes");
const UserRepository_1 = require("../../database/repository/UserRepository");
const AuthToken_1 = require("../../types/enums/AuthToken");
const ApiError_1 = require("../../utils/ApiError");
const AuthManager_1 = require("../../utils/AuthManager");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Helper_1 = require("../../utils/Helper");
const User_1 = require("../../types/enums/User");
const RegistrationEmail_1 = require("../../utils/email/RegistrationEmail");
const EmailService_1 = require("../../provider/EmailService");
class RegistrationAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const salt = await bcrypt_1.default.genSalt(Number(process.env.SALT_SIZE));
        const password = await bcrypt_1.default.hash(this.payload.password, salt);
        this.payload.password = password;
        const otpCode = (0, Helper_1.makeOTPCode)();
        const user = await UserRepository_1.UserRepository.create(this.payload);
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User creation failed');
        }
        const otp = {
            code: otpCode,
            issuedAt: new Date(),
            otpType: User_1.OTPTypes.EMAIL,
        };
        await UserRepository_1.UserRepository.updateById(String(user._id), {
            otp,
        });
        const token = await AuthManager_1.AuthManager.generateToken(String(user._id), AuthToken_1.TokenType.VERIFY_EMAIL);
        if (!token) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token generation failed');
        }
        const registrationEmail = new RegistrationEmail_1.RegistrationEmail({
            email: this.payload.email,
            token: token.token,
            expiresIn: token.expires,
            otp: otpCode,
        });
        await EmailService_1.EmailService.sendEmail(registrationEmail);
        return {
            user,
            verifyEmailToken: token,
        };
    }
}
exports.RegistrationAction = RegistrationAction;
//# sourceMappingURL=RegistrationAction.js.map