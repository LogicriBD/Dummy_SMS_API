"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestPayload = exports.validatePayloadBroker = exports.getRequestPayload = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../utils/ApiError");
const getRequestPayload = (req) => {
    switch (req.method) {
        case 'GET':
            return req.query;
        case 'POST':
            return req.body;
        default:
            return null;
    }
};
exports.getRequestPayload = getRequestPayload;
const validatePayloadBroker = (schema) => {
    return (payload) => {
        const result = schema.safeParse(payload);
        if (result.success) {
            return result.data;
        }
        const messages = [];
        for (const issue of result.error.issues) {
            const path = issue.path.join('.');
            const description = `${path} - ${issue.message} (${issue.code})`;
            messages.push(description);
        }
        const message = messages.length ? messages.join('. ') : 'Unknown Validation Error';
        throw new Error(`Validation Error: ${message}`);
    };
};
exports.validatePayloadBroker = validatePayloadBroker;
const validateRequestPayload = (schema) => {
    return (req, res, next) => {
        const payload = (0, exports.getRequestPayload)(req);
        if (!payload) {
            next();
            return;
        }
        const result = schema.safeParse(payload);
        if (result.success) {
            switch (req.method) {
                case 'GET':
                    req.query = result.data;
                case 'POST':
                    req.body = result.data;
            }
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
    };
};
exports.validateRequestPayload = validateRequestPayload;
//# sourceMappingURL=ValidateRequestPayload.js.map