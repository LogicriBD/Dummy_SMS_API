"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenAction = void 0;
const AuthRepository_1 = require("../../database/repository/AuthRepository");
const AuthToken_1 = require("../../types/enums/AuthToken");
const AuthManager_1 = require("../../utils/AuthManager");
class RefreshTokenAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const authToken = await AuthRepository_1.AuthRepository.findByTokenAndTokenType(this.payload.refreshToken, AuthToken_1.TokenType.REFRESH);
        if (!authToken) {
            throw new Error('Invalid refresh token');
        }
        const user = authToken.user;
        console.log(authToken);
        const accessToken = await AuthManager_1.AuthManager.generateToken(authToken.user._id.toString(), AuthToken_1.TokenType.ACCESS);
        if (!accessToken) {
            throw new Error('Token generation failed');
        }
        return {
            accessToken,
        };
    }
}
exports.RefreshTokenAction = RefreshTokenAction;
//# sourceMappingURL=RefreshTokenAction.js.map