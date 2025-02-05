import { z } from 'zod';
import { validateRequestPayload } from '../../../middleware/ValidateRequestPayload';
import { UserType } from '../../../types/enums/User';
import { paginationsParams } from '../../../utils/Validation';

export const fetchUsersSchema = z
  .object({
    userType: z.nativeEnum(UserType).optional(),
    search: z.string().optional(),
  })
  .merge(paginationsParams);

export type FetchUsersParams = z.infer<typeof fetchUsersSchema>;
export const fetchUsersValidator = validateRequestPayload(fetchUsersSchema);
