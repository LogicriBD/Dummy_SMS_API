import { z } from 'zod';
import { validateRequestPayload } from '../../../middleware/ValidateRequestPayload';
import { elevenDigitPhoneNumberSchema } from '../../../utils/Validation';

export const smsSchema = z.object({
  phone: elevenDigitPhoneNumberSchema,
  text: z.string(),
});

export type SMSRequestBody = z.infer<typeof smsSchema>;
export const smsRequestValidator = validateRequestPayload(smsSchema);
