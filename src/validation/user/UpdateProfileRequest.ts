import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';
import { elevenDigitPhoneNumberSchema } from '../../utils/Validation';

export const updateUserRequestSchema = z.object({
  username: z.string().optional(),
  phone: z.array(elevenDigitPhoneNumberSchema).optional(),
});

export type UpdateUserRequestBody = z.infer<typeof updateUserRequestSchema>;
export const updateUserRequestValidator = validateRequestPayload(updateUserRequestSchema);
