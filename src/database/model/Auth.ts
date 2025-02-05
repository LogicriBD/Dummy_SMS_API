import { Document, Model, model, Schema } from 'mongoose';
import { allTokenTypes, TokenType } from '../../types/enums/AuthToken';

export interface AuthTokenProps extends Document {
  user: {
    _id: Schema.Types.ObjectId;
    email: string;
    username: string;
  };
  token: string;
  type: TokenType;
  expires: Date;
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<AuthTokenProps> = new Schema<AuthTokenProps>(
  {
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      email: {
        type: Schema.Types.String,
        required: true,
        trim: true,
      },
      username: {
        type: Schema.Types.String,
        required: true,
        trim: true,
      },
    },
    token: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      enum: allTokenTypes,
    },
    expires: {
      type: Schema.Types.Date,
      required: true,
    },
    blacklisted: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: 'auth_tokens',
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

schema.index({ 'user._id': 1, token: 1, type: 1 }, { name: 'by_user.id_token_type', unique: true });
export const AuthToken: Model<AuthTokenProps> = model<AuthTokenProps>('Auth_Token', schema);
