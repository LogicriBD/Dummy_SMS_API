"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAction = void 0;
const http_status_codes_1 = require("http-status-codes");
const UserRepository_1 = require("../../database/repository/UserRepository");
const ApiError_1 = require("../../utils/ApiError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AuthManager_1 = require("../../utils/AuthManager");
const AuthToken_1 = require("../../types/enums/AuthToken");
const Helper_1 = require("../../utils/Helper");
class LoginAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const user = await UserRepository_1.UserRepository.findByEmail(this.payload.email);
        const hashedPassword = user.password;
        const passwordMatch = await bcrypt_1.default.compare(this.payload.password, hashedPassword);
        if (!passwordMatch) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid password');
        }
        if (!user.active) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your account has been deactivated. Please contact support for more information.');
        }
        if (user.lock) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Your account has been locked. Please contact support for more information.');
        }
        if (user.verified) {
            const authTokens = await AuthManager_1.AuthManager.generateAuthTokens(String(user._id));
            return {
                user: (0, Helper_1.filterUser)(user),
                ...authTokens,
            };
        }
        else {
            const token = await AuthManager_1.AuthManager.generateToken(String(user._id), AuthToken_1.TokenType.VERIFY_EMAIL);
            if (!token) {
                throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token generation failed');
            }
            return {
                user: (0, Helper_1.filterUser)(user),
                verifyEmailToken: token,
            };
        }
    }
}
exports.LoginAction = LoginAction;
//# sourceMappingURL=LoginAction.js.map