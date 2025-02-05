import { z } from 'zod';
import { validateRequestPayload } from '../../../middleware/ValidateRequestPayload';

export const resetPasswordVerificationSchema = z.object({
  otp: z.string().length(6),
  token: z.string().min(32),
});

export type ResetPasswordVerificationRequestBody = z.infer<typeof resetPasswordVerificationSchema>;
export const resetPasswordVerificationValidator = validateRequestPayload(resetPasswordVerificationSchema);
