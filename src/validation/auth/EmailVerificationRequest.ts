import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';

export const emailVerificationSchema = z.object({
  otp: z.string().length(6),
  token: z.string().min(32),
});

export type EmailVerificationRequestBody = z.infer<typeof emailVerificationSchema>;
export const emailVerificationValidator = validateRequestPayload(emailVerificationSchema);
