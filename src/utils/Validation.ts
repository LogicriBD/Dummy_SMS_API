import _ from 'lodash';
import { ZodIssue, ZodObject, ZodSchema, ZodType, ZodTypeAny, z } from 'zod';
import { ExcelRow, RowValidationResult } from '../types/Uploader';
import { toResizedPhoneNumber } from './Helper';

export const nonEmptyString = z.string().trim().min(1);
export const optionalString = z.string().trim().optional();
export const nullableString = z.string().trim().nullable();
export const nullableNumber = z.coerce.number().nullable();

export const possiblyEmptyEmail = z
  .string()
  .optional()
  .transform((email?: string) => (email ? email.trim() : undefined))
  .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
    message: 'Invalid email address',
    path: ['email'],
  });

export const possiblyEmptyString = z.string().trim().min(0);
export const resourceIDSchema = z.string().length(24);
export const phoneNumberSchema = z
  .string()
  .regex(/^(\+)?(88)?(0)?1[3456789][0-9]{8}$/, 'Phone number is not valid, please recheck');
export const elevenDigitPhoneNumberSchema = phoneNumberSchema.transform((phone) => toResizedPhoneNumber(phone));
export const nidSchema = z.string().regex(/^[0-9]{10,13}$/, 'NID is not valid');

export const getKeysOfSchema = <T extends ZodTypeAny>(schema: T) => {
  if (!(schema instanceof ZodObject)) {
    return [];
  }

  return Object.entries(schema.shape).map(([key, val]) => key);
};

export const getExcelRowValidationResult = <SchemaType extends ZodType>(
  schema: ZodSchema,
  row: ExcelRow<SchemaType>,
): RowValidationResult<SchemaType> => {
  const validationResult = schema.safeParse(row);
  if (!validationResult.success) {
    return { success: false, data: { row, issues: validationResult.error.issues } };
  }

  return { success: true, data: validationResult.data };
};

export const formatIssueMessage = (issue: ZodIssue) => issue.path.join('->') + ': ' + issue.message.replace(/,/g, '.');

export const paginationsParams = z.object({
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
});
