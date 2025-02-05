import { z } from 'zod';
import { validatePayloadBroker } from '../../../middleware/ValidateRequestPayload';

export const brokerMessageSchema = z.object({
  message: z.string(),
});

export type BrokerMessageRequestBody = z.infer<typeof brokerMessageSchema>;
export const brokerMessageValidator = validatePayloadBroker(brokerMessageSchema);
