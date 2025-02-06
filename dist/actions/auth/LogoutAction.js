"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutAction = void 0;
const http_status_codes_1 = require("http-status-codes");
const AuthRepository_1 = require("../../database/repository/AuthRepository");
const ApiError_1 = require("../../utils/ApiError");
class LogoutAction {
    constructor(payload, currentUser) {
        this.payload = payload;
        this.currentUser = currentUser;
    }
    async execute() {
        const logout = await AuthRepository_1.AuthRepository.deleteManyByUserIdAndToken({
            userId: this.currentUser.id,
            token: this.payload.refreshToken,
        });
        if (logout.deletedCount === 0) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid refresh token');
        }
        return {
            message: 'Logout successful',
        };
    }
}
exports.LogoutAction = LogoutAction;
//# sourceMappingURL=LogoutAction.js.map