"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordVerificationValidator = exports.resetPasswordVerificationSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.resetPasswordVerificationSchema = zod_1.z.object({
    otp: zod_1.z.string().length(6),
    token: zod_1.z.string().min(32),
});
exports.resetPasswordVerificationValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.resetPasswordVerificationSchema);
//# sourceMappingURL=ResetPasswordVerificationRequest.js.map