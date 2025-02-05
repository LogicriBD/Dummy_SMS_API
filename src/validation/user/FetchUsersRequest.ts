import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';
import { paginationsParams } from '../../utils/Validation';

export const fetchUsersSchema = z
  .object({
    search: z.string().optional(),
  })
  .merge(paginationsParams);

export type FetchUsersParams = z.infer<typeof fetchUsersSchema>;
export const fetchUsersValidator = validateRequestPayload(fetchUsersSchema);
