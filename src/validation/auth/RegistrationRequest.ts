import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
});

export type RegistrationRequestBody = z.infer<typeof registrationSchema>;
export const registrationValidator = validateRequestPayload(registrationSchema);
