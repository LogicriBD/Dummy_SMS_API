"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textSMSRequestValidator = exports.multimediaSMSRequestValidator = exports.smsSchema = void 0;
const zod_1 = require("zod");
const Validation_1 = require("../../utils/Validation");
const SMS_1 = require("../../database/model/SMS");
const ApiError_1 = require("../../utils/ApiError");
const http_status_codes_1 = require("http-status-codes");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
const UserRepository_1 = require("../../database/repository/UserRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.smsSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
    receiver: Validation_1.elevenDigitPhoneNumberSchema,
    message: zod_1.z.string().min(1),
    masking: Validation_1.maskingSchema,
    MsgType: zod_1.z.enum(SMS_1.allMessageTypes),
});
const multimediaSMSRequestValidator = async (req, res, next) => {
    try {
        const username = req.body.userName;
        const password = req.body.password;
        const user = await UserRepository_1.UserRepository.findByUsername(username);
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials, user not found for given username');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials, password does not match');
        }
        if (!req.body.receiver) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, 'Receiver is required');
        }
        const isReceiverValid = user.phone.includes(req.body.receiver);
        if (!isReceiverValid) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid receiver, receiver not found for given username');
        }
        return (0, ValidateRequestPayload_1.validateRequestPayload)(exports.smsSchema)(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
exports.multimediaSMSRequestValidator = multimediaSMSRequestValidator;
const textSMSRequestValidator = async (req, res, next) => {
    try {
        const payload = req.params;
        if (!payload) {
            next();
            return;
        }
        const username = req.params.userName;
        const password = req.params.password;
        const user = await UserRepository_1.UserRepository.findByUsername(username);
        if (!user) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials, user not found for given username');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials, password does not match');
        }
        if (!req.params.receiver) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, 'Receiver is required');
        }
        const isReceiverValid = user.phone.includes(req.params.receiver);
        if (!isReceiverValid) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid receiver, receiver not found for given username');
        }
        const result = exports.smsSchema.safeParse(payload);
        if (result.success) {
            req.params = result.data;
            next();
            return;
        }
        const messages = [];
        for (const issue of result.error.issues) {
            const path = issue.path.join('.');
            const description = `${path} - ${issue.message} (${issue.code})`;
            messages.push(description);
        }
        const message = messages.length ? messages.join('. ') : 'Validation Error';
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, message);
    }
    catch (error) {
        next(error);
    }
};
exports.textSMSRequestValidator = textSMSRequestValidator;
//# sourceMappingURL=SMSRequest.js.map