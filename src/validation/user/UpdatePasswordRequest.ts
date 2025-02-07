import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type ChangePasswordRequestBody = z.infer<typeof changePasswordSchema>;
export const changePasswordValidator = validateRequestPayload(changePasswordSchema);
