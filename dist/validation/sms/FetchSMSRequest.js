"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSMSValidator = exports.fetchSMSSchema = void 0;
const zod_1 = require("zod");
const ValidateRequestPayload_1 = require("../../middleware/ValidateRequestPayload");
const Validation_1 = require("../../utils/Validation");
exports.fetchSMSSchema = zod_1.z
    .object({
    search: zod_1.z.string().optional(),
})
    .merge(Validation_1.paginationsParams);
exports.fetchSMSValidator = (0, ValidateRequestPayload_1.validateRequestPayload)(exports.fetchSMSSchema);
//# sourceMappingURL=FetchSMSRequest.js.map