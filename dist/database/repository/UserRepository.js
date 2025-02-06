"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../../utils/ApiError");
const Helper_1 = require("../../utils/Helper");
const User_1 = require("../model/User");
class UserRepositoyImpl {
    async findById(id) {
        const user = await User_1.User.findById((0, Helper_1.toMongoID)(id));
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `User with id ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await User_1.User.findOne({
            email,
        });
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `User with email ${email} not found`);
        }
        return user;
    }
    async findOneByEmail(email) {
        return await User_1.User.findOne({
            email,
        });
    }
    async findByUsername(username) {
        const user = await User_1.User.findOne({
            username,
        });
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `User with username ${username} not found`);
        }
        return user;
    }
    async findByPhone(phone) {
        const user = await User_1.User.findOne({
            phone,
        });
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `User with phone ${phone} not found`);
        }
        return user;
    }
    async find(params) {
        const findParams = {};
        if (params.search) {
            findParams.username = { $regex: new RegExp(params.search, 'i') };
        }
        if (params.page && params.limit) {
            return await User_1.User.find(findParams)
                .select('-password')
                .skip((params.page - 1) * params.limit)
                .limit(params.limit);
        }
        return await User_1.User.find(params);
    }
    async count(params) {
        const findParams = {};
        if (params.search) {
            findParams.username = { $regex: new RegExp(params.search, 'i') };
        }
        return await User_1.User.countDocuments(findParams);
    }
    async create(payload) {
        return await User_1.User.create({
            ...payload,
            mode: process.env.NODE_ENV,
        });
    }
    async updateById(id, payload) {
        const updateResult = await User_1.User.updateOne({ _id: (0, Helper_1.toMongoID)(id) }, payload);
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
            throw new Error(`User with id ${id} not found or not updated`);
        }
        return await this.findById(id);
    }
}
exports.UserRepository = new UserRepositoyImpl();
//# sourceMappingURL=UserRepository.js.map