import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';

export const forgeoPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordRequestBody = z.infer<typeof forgeoPasswordSchema>;
export const forgotPasswordValidator = validateRequestPayload(forgeoPasswordSchema);
