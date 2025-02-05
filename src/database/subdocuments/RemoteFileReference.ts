import { Schema } from 'mongoose';

export type RemoteFileReference = {
  originalName: string;
  downloadUrl: string;
  mimeType: string;
  visibility?: 'public' | 'private';
};

export const remoteFileReferenceSchema = new Schema<RemoteFileReference>(
  {
    originalName: Schema.Types.String,
    downloadUrl: Schema.Types.String,
    mimeType: Schema.Types.String,
    visibility: {
      type: Schema.Types.String,
      enum: ['public', 'private'],
      required: false,
      default: 'public',
    },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: false,
  },
);
