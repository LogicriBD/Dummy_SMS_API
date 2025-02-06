"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRequestValidator = exports.updateUserRequestSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
const Validation_1 = require("../../utils/Validation");
exports.updateUserRequestSchema = zod_1.z.object({
    username: zod_1.z.string().optional(),
    phone: zod_1.z.array(Validation_1.elevenDigitPhoneNumberSchema).optional(),
});
exports.updateUserRequestValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.updateUserRequestSchema);
//# sourceMappingURL=UpdateProfileRequest.js.map