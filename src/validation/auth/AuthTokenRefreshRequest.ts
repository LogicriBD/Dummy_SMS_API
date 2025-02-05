import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';

export const authTokenRefreshSchema = z.object({
  refreshToken: z.string().min(32),
});

export type AuthTokenRefreshRequestBody = z.infer<typeof authTokenRefreshSchema>;
export const authTokenRefreshValidator = validateRequestPayload(authTokenRefreshSchema);
