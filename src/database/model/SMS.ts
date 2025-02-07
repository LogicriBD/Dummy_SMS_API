import { Document, Model, model, Schema } from 'mongoose';
import { RemoteFileReference } from '../../types/Misc';
import { remoteFileReferenceSchema } from '../subdocuments/RemoteFileReference';

export const messageTypes = {
  TEXT: 'TEXT',
  MULTIMEDIA: 'MULTIMEDIA',
} as const;

export type MessageType = (typeof messageTypes)[keyof typeof messageTypes];
export const allMessageTypes = ['TEXT', 'MULTIMEDIA'] as const;

export interface SMSProps extends Document {
  email: string;
  masking?: string;
  receiver: string;
  type: MessageType;
  message?: string;
  media?: RemoteFileReference[];
  masked?: boolean;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<SMSProps> = new Schema<SMSProps>(
  {
    email: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    masking: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    receiver: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
      enum: allMessageTypes,
      default: 'TEXT',
    },
    message: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    media: {
      type: [remoteFileReferenceSchema],
      required: false,
    },
    masked: {
      type: Schema.Types.Boolean,
      default: false,
    },
    read: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    collection: 'sms',
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

schema.index(
  { receiver: 1, createdAt: -1 },
  {
    name: 'by_receiver',
    sparse: true,
  },
);
export const SMS: Model<SMSProps> = model<SMSProps>('SMS', schema);
