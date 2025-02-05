import { z } from 'zod';
import { validateRequestPayload } from '../../../middleware/ValidateRequestPayload';

export const logoutSchema = z.object({
  refreshToken: z.string().min(32),
});

export type LogoutRequestBody = z.infer<typeof logoutSchema>;
export const logoutValidator = validateRequestPayload(logoutSchema);
