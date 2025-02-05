import { SMSProps } from '../../database/model/SMS';

export type CreateSMSPayload = Partial<SMSProps>;
export type FindSMSPayload = { receiver?: string; page?: number; limit?: number };
export type CountSMSPayload = { receiver?: string; read?: boolean };
