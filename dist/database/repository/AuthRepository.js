"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../../utils/ApiError");
const Helper_1 = require("../../utils/Helper");
const Auth_1 = require("../model/Auth");
class AuthRepositoryImpl {
    async insertOne(payload) {
        return await Auth_1.AuthToken.create(payload);
    }
    async findById(id) {
        return await Auth_1.AuthToken.findById((0, Helper_1.toMongoID)(id));
    }
    async findByTokenAndTokenType(token, type) {
        const authToken = await Auth_1.AuthToken.findOne({ token, type });
        if (!authToken) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `Auth token with token ${token} and type ${type} not found`);
        }
        return authToken;
    }
    async findUserTokenByTokenAndType(payload) {
        const authToken = await Auth_1.AuthToken.findOne({
            'user._id': (0, Helper_1.toMongoID)(payload.userId),
            token: payload.token,
            type: payload.type,
        });
        if (!authToken) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `Auth token with token ${payload.token}, userId: ${payload.userId} and type: ${payload.type} not found`);
        }
        return authToken;
    }
    async deleteManyByUserId(userId) {
        return await Auth_1.AuthToken.deleteMany({
            'user._id': (0, Helper_1.toMongoID)(userId),
        });
    }
    async deleteManyByUserIdAndToken(payload) {
        return await Auth_1.AuthToken.deleteMany({
            'user._id': (0, Helper_1.toMongoID)(payload.userId),
            token: payload.token,
        });
    }
    async updateOneById(id, payload) {
        return await Auth_1.AuthToken.updateOne({
            _id: (0, Helper_1.toMongoID)(id),
        }, payload);
    }
}
exports.AuthRepository = new AuthRepositoryImpl();
//# sourceMappingURL=AuthRepository.js.map