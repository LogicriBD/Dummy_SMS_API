"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveApplicationError = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../utils/ApiError");
const Helper_1 = require("../utils/Helper");
const resolveApplicationError = async (err, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
    }
    let message = err.message;
    let isOperational = false;
    const isAppInProductionMode = process.env.NODE_ENV === 'prod';
    const isAppInDevelopmentMode = process.env.NODE_ENV === 'dev';
    res.locals.errorMessage = err.message;
    const response = {
        code: statusCode,
        message,
        ...(isAppInDevelopmentMode && { stack: err.stack }),
    };
    if (statusCode != http_status_codes_1.StatusCodes.UNAUTHORIZED) {
        (0, Helper_1.log)('error', err.toString(), err);
    }
    res.status(statusCode).send(response);
};
exports.resolveApplicationError = resolveApplicationError;
//# sourceMappingURL=ResolveApplicationError.js.map