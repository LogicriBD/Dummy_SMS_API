import { z } from 'zod';
import { validateRequestPayload } from '../../../middleware/ValidateRequestPayload';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequestBody = z.infer<typeof loginSchema>;
export const loginValidator = validateRequestPayload(loginSchema);
