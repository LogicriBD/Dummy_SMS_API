"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutValidator = exports.logoutSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.logoutSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(32),
});
exports.logoutValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.logoutSchema);
//# sourceMappingURL=LogoutRequest.js.map