"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationValidator = exports.emailVerificationSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.emailVerificationSchema = zod_1.z.object({
    otp: zod_1.z.string().length(6),
    token: zod_1.z.string().min(32),
});
exports.emailVerificationValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.emailVerificationSchema);
//# sourceMappingURL=EmailVerificationRequest.js.map