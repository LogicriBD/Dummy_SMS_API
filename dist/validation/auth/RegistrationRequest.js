"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationValidator = exports.registrationSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
exports.registrationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    username: zod_1.z.string().min(3),
});
exports.registrationValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.registrationSchema);
//# sourceMappingURL=RegistrationRequest.js.map