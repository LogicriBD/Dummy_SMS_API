import { z } from 'zod';
import { validateRequestPayload } from '../../../middleware/ValidateRequestPayload';

export const brokerMessageSchema = z.object({
  message: z.string(),
});

export type BrokerMessageRequestBody = z.infer<typeof brokerMessageSchema>;
export const brokerMessageValidator = validateRequestPayload(brokerMessageSchema);
