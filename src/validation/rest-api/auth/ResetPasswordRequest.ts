import { z } from 'zod';
import { validateRequestPayload } from '../../../middleware/ValidateRequestPayload';

export const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(6),
});

export type ResetPasswordRequestBody = z.infer<typeof resetPasswordSchema>;
export const resetPasswordValidator = validateRequestPayload(resetPasswordSchema);
