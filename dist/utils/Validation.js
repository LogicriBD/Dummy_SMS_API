"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationsParams = exports.formatIssueMessage = exports.getExcelRowValidationResult = exports.getKeysOfSchema = exports.nidSchema = exports.elevenDigitPhoneNumberSchema = exports.phoneNumberSchema = exports.resourceIDSchema = exports.maskingSchema = exports.possiblyEmptyString = exports.possiblyEmptyEmail = exports.nullableNumber = exports.nullableString = exports.optionalString = exports.nonEmptyString = void 0;
const zod_1 = require("zod");
const Helper_1 = require("./Helper");
exports.nonEmptyString = zod_1.z.string().trim().min(1);
exports.optionalString = zod_1.z.string().trim().optional();
exports.nullableString = zod_1.z.string().trim().nullable();
exports.nullableNumber = zod_1.z.coerce.number().nullable();
exports.possiblyEmptyEmail = zod_1.z
    .string()
    .optional()
    .transform((email) => (email ? email.trim() : undefined))
    .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
    message: 'Invalid email address',
    path: ['email'],
});
exports.possiblyEmptyString = zod_1.z.string().trim().min(0);
exports.maskingSchema = zod_1.z
    .string()
    .optional()
    .refine((masking) => (masking && masking.length <= 11) || !masking, {
    message: 'Masking should be at most 11 characters long',
});
exports.resourceIDSchema = zod_1.z.string().length(24);
exports.phoneNumberSchema = zod_1.z
    .string()
    .regex(/^(\+)?(88)?(0)?1[3456789][0-9]{8}$/, 'Phone number is not valid, please recheck');
exports.elevenDigitPhoneNumberSchema = exports.phoneNumberSchema.transform((phone) => (0, Helper_1.toResizedPhoneNumber)(phone));
exports.nidSchema = zod_1.z.string().regex(/^[0-9]{10,13}$/, 'NID is not valid');
const getKeysOfSchema = (schema) => {
    if (!(schema instanceof zod_1.ZodObject)) {
        return [];
    }
    return Object.entries(schema.shape).map(([key, val]) => key);
};
exports.getKeysOfSchema = getKeysOfSchema;
const getExcelRowValidationResult = (schema, row) => {
    const validationResult = schema.safeParse(row);
    if (!validationResult.success) {
        return { success: false, data: { row, issues: validationResult.error.issues } };
    }
    return { success: true, data: validationResult.data };
};
exports.getExcelRowValidationResult = getExcelRowValidationResult;
const formatIssueMessage = (issue) => issue.path.join('->') + ': ' + issue.message.replace(/,/g, '.');
exports.formatIssueMessage = formatIssueMessage;
exports.paginationsParams = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1),
    limit: zod_1.z.coerce.number().min(1),
});
//# sourceMappingURL=Validation.js.map