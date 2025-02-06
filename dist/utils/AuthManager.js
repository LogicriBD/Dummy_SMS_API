"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = void 0;
const AuthRepository_1 = require("../database/repository/AuthRepository");
const AuthToken_1 = require("../types/enums/AuthToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const ApiError_1 = require("./ApiError");
const http_status_codes_1 = require("http-status-codes");
const UserRepository_1 = require("../database/repository/UserRepository");
class AuthManagerImpl {
    constructor() {
        this.generateToken = async (userId, type) => {
            try {
                let expires;
                if (type === AuthToken_1.TokenType.ACCESS) {
                    expires = new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES) * 60 * 1000);
                }
                else if (type === AuthToken_1.TokenType.REFRESH) {
                    expires = new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRATION_MINUTES) * 60 * 1000);
                }
                else if (type === AuthToken_1.TokenType.RESET_PASSWORD) {
                    expires = new Date(Date.now() + Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES) * 60 * 1000);
                }
                else if (type === AuthToken_1.TokenType.VERIFY_EMAIL) {
                    expires = new Date(Date.now() + Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES) * 60 * 1000);
                }
                else if (type === AuthToken_1.TokenType.RESET_LINK) {
                    expires = new Date(Date.now() + Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES) * 60 * 1000);
                }
                else {
                    return null;
                }
                const id = (0, uuid_1.v4)();
                const payload = {
                    id,
                    userId,
                    type,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(expires.getTime() / 1000),
                };
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
                const user = await UserRepository_1.UserRepository.findById(userId);
                if (type !== AuthToken_1.TokenType.ACCESS) {
                    const authToken = await AuthRepository_1.AuthRepository.insertOne({
                        user: {
                            _id: user.id,
                            email: user.email,
                            username: user.username,
                        },
                        expires,
                        type,
                        token,
                    });
                    if (!authToken) {
                        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Token could not be created for userId: ${userId}`);
                    }
                }
                return { token, expires };
            }
            catch (error) {
                throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Token could not be created for userId: ${userId} due to ${error.message}`);
            }
        };
        this.generateAuthTokens = async (userId) => {
            await AuthRepository_1.AuthRepository.deleteManyByUserId(userId);
            const access = await this.generateToken(userId, AuthToken_1.TokenType.ACCESS);
            const refresh = await this.generateToken(userId, AuthToken_1.TokenType.REFRESH);
            return {
                access,
                refresh,
            };
        };
        this.generateNewAccessToken = async (refreshToken) => {
            const token = await this.verifyToken(refreshToken);
            const access = this.generateToken(token.userId, AuthToken_1.TokenType.ACCESS);
            return access;
        };
    }
    async verifyToken(token) {
        const JWTSecret = process.env.JWT_SECRET;
        if (!JWTSecret) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `JWT Secret not found`);
        }
        const payload = jsonwebtoken_1.default.verify(token, JWTSecret);
        if (!payload || !payload.id || !payload.userId || !payload.type) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, `Malformed Token`);
        }
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, `Token has expired`);
        }
        if (payload.type === AuthToken_1.TokenType.ACCESS) {
            return {
                tokenId: payload.id,
                userId: payload.userId,
                type: payload.type,
            };
        }
        const authToken = await AuthRepository_1.AuthRepository.findUserTokenByTokenAndType({
            userId: payload.userId,
            token: token,
            type: payload.type,
        });
        if (!authToken) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, `Token is Invalid`);
        }
        return {
            tokenId: payload.id,
            userId: payload.userId,
            type: payload.type,
        };
    }
    async getVerifiedUser(email) {
        const user = await UserRepository_1.UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, 'This phone number has not been registered. Please contact your administrator for help.');
        }
        else if (!user.active) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your account has been deactivated. Please contact your administrator for more information.');
        }
        else if (!user.verified) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your account has not been verified yet. Please verify to continue.');
        }
        else if (user.lock) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Your account has been locked. Please contact your administrator for more information.');
        }
        return user;
    }
    async getRegisteredUser(email) {
        const user = await UserRepository_1.UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, 'The phone number is not yet registered. Please register to continue.');
        }
        else if (!user.active) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your account has been deactivated. Please contact your administrator for more information.');
        }
        else if (user.verified) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your account has already been registered. Please login to continue.');
        }
        else if (user.lock) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Your account has been locked. Please contact your administrator for more information.');
        }
        return user;
    }
}
exports.AuthManager = new AuthManagerImpl();
//# sourceMappingURL=AuthManager.js.map