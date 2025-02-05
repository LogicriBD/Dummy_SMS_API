import { z } from 'zod';
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload';
import { paginationsParams } from '../../utils/Validation';

export const fetchSMSSchema = z
  .object({
    search: z.string().optional(),
  })
  .merge(paginationsParams);

export type FetchSMSParams = z.infer<typeof fetchSMSSchema>;
export const fetchSMSValidator = validateRequestPayload(fetchSMSSchema);
