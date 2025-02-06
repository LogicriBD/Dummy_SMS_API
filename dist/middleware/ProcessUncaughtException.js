"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUncaughtException = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../utils/ApiError");
const processUncaughtException = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.ApiError)) {
        const statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_codes_1.StatusCodes[statusCode];
        error = new ApiError_1.ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.processUncaughtException = processUncaughtException;
//# sourceMappingURL=ProcessUncaughtException.js.map