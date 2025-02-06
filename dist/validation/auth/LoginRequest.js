"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.loginSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.loginValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.loginSchema);
//# sourceMappingURL=LoginRequest.js.map