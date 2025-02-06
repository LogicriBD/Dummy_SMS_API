"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTokenRefreshValidator = exports.authTokenRefreshSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.authTokenRefreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(32),
});
exports.authTokenRefreshValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.authTokenRefreshSchema);
//# sourceMappingURL=AuthTokenRefreshRequest.js.map