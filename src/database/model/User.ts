import { Document, Model, Schema, model } from 'mongoose';
import { allUserTypes, OTPTypes, UserType } from '../../types/enums/User';

export const userModes = ['production', 'development', 'test'] as const;
export const otpTypes = ['email', 'forgot-password', 'phone'] as const;
export type OTPType = (typeof otpTypes)[number];
export type UserMode = (typeof userModes)[number];

export interface UserProps extends Document {
  email: string;
  username: string;
  photo?: string;
  phone?: string;
  password: string;
  type: UserType;
  mode?: UserMode;
  active: boolean;
  verified: boolean;
  otp?: {
    code: string;
    issuedAt: Date;
    otpType: OTPType;
    verifiedAt?: Date;
  };
  lock?: {
    loginAttempts: number;
    isLocked: boolean;
    feedback?: string;
    lockedAt?: Date;
  };
  auth?: {
    refreshToken: string;
    expiresAt: Date;
    issuedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type UserAuthInfo = { id: string } & Pick<UserProps, 'username' | 'photo' | 'type' | 'active' | 'verified' | 'lock'>;
export type UserMethods = {
  getAuthInfo: () => UserAuthInfo;
};
export type UserModel = Model<UserProps, {}, UserMethods>;
const schema = new Schema<UserProps, UserModel, UserMethods>(
  {
    email: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    phone: {
      type: Schema.Types.String,
      required: false,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    photo: {
      type: Schema.Types.String,
      required: false,
    },
    type: {
      type: Schema.Types.String,
      required: true,
      enum: allUserTypes,
    },
    mode: {
      type: Schema.Types.String,
      enum: userModes,
      required: false,
    },
    active: {
      type: Schema.Types.Boolean,
      required: false,
      default: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      required: false,
      default: false,
    },
    otp: {
      type: {
        code: { type: Schema.Types.String, required: true },
        issuedAt: { type: Schema.Types.Date, required: true },
        otpType: {
          type: Schema.Types.String,
          default: OTPTypes.EMAIL,
          enum: otpTypes,
          required: true,
        },
        verifiedAt: { type: Schema.Types.Date, required: false },
      },
      _id: false,
      required: false,
    },
    lock: {
      type: {
        isLocked: {
          type: Schema.Types.Boolean,
          required: false,
          default: false,
        },
        lockedAt: {
          type: Schema.Types.Date,
          required: false,
        },
        feedback: {
          type: Schema.Types.String,
          required: false,
        },
        loginAttempts: {
          type: Schema.Types.Number,
          required: false,
          default: 0,
        },
      },
      _id: false,
      required: false,
    },
    auth: {
      type: {
        refreshToken: {
          type: Schema.Types.String,
          required: true,
        },
        expiresAt: { type: Schema.Types.Date, required: true },
        issuedAt: { type: Schema.Types.Date, required: true },
      },
      _id: false,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: 'users',
  },
);

schema.methods.getAuthInfo = function () {
  return {
    id: String(this._id),
    email: this.email,
    username: this.username,
    type: this.type,
    photo: this.photo,
    active: this.active,
    verified: this.verified,
    lock: this.lock,
  };
};

schema.index({ email: 1 }, { name: 'by_email', unique: true });
schema.index(
  { 'otp.code': 1 },
  { name: 'by_otp_code', unique: true, partialFilterExpression: { 'otp.code': { $exists: true } }, sparse: true },
);
schema.index(
  { 'auth.refreshToken': 1 },
  {
    name: 'by_refresh_token',
    unique: true,
    partialFilterExpression: { 'auth.refreshToken': { $exists: true } },
    sparse: true,
  },
);
schema.index(
  { phone: 1 },
  { name: 'by_phone', unique: true, partialFilterExpression: { phone: { $exists: true } }, sparse: true },
);

export const User = model<UserProps, UserModel>('User', schema);
