"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordAction = void 0;
const UserRepository_1 = require("../../database/repository/UserRepository");
const AuthManager_1 = require("../../utils/AuthManager");
const bcrypt_1 = __importDefault(require("bcrypt"));
class ResetPasswordAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const verifiedToken = await AuthManager_1.AuthManager.verifyToken(this.payload.token);
        if (!verifiedToken) {
            throw new Error('Invalid token');
        }
        const user = await UserRepository_1.UserRepository.findById(verifiedToken.userId);
        const salt = await bcrypt_1.default.genSalt(Number(process.env.SALT_SIZE));
        const hashedPassword = await bcrypt_1.default.hash(this.payload.password, salt);
        user.password = hashedPassword;
        await UserRepository_1.UserRepository.updateById(verifiedToken.userId, user);
        return {
            message: 'Password reset successfully',
        };
    }
}
exports.ResetPasswordAction = ResetPasswordAction;
//# sourceMappingURL=ResetPasswordAction.js.map