"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordValidator = exports.forgeoPasswordSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.forgeoPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.forgotPasswordValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.forgeoPasswordSchema);
//# sourceMappingURL=ForgotPasswordRequest.js.map