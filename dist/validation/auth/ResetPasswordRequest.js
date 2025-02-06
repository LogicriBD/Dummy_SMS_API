"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.resetPasswordSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(32),
    password: zod_1.z.string().min(6),
});
exports.resetPasswordValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.resetPasswordSchema);
//# sourceMappingURL=ResetPasswordRequest.js.map