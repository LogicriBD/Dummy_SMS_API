"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.otpTypes = exports.userModes = void 0;
const mongoose_1 = require("mongoose");
const User_1 = require("../../types/enums/User");
exports.userModes = ['production', 'development', 'test'];
exports.otpTypes = ['email', 'forgot-password'];
const schema = new mongoose_1.Schema({
    email: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    username: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    phone: {
        type: [mongoose_1.Schema.Types.String],
        required: false,
    },
    mode: {
        type: mongoose_1.Schema.Types.String,
        enum: exports.userModes,
        required: false,
    },
    active: {
        type: mongoose_1.Schema.Types.Boolean,
        required: false,
        default: true,
    },
    verified: {
        type: mongoose_1.Schema.Types.Boolean,
        required: false,
        default: false,
    },
    otp: {
        type: {
            code: { type: mongoose_1.Schema.Types.String, required: true },
            issuedAt: { type: mongoose_1.Schema.Types.Date, required: true },
            otpType: {
                type: mongoose_1.Schema.Types.String,
                default: User_1.OTPTypes.EMAIL,
                enum: exports.otpTypes,
                required: true,
            },
            verifiedAt: { type: mongoose_1.Schema.Types.Date, required: false },
        },
        _id: false,
        required: false,
    },
    lock: {
        type: {
            isLocked: {
                type: mongoose_1.Schema.Types.Boolean,
                required: false,
                default: false,
            },
            lockedAt: {
                type: mongoose_1.Schema.Types.Date,
                required: false,
            },
            feedback: {
                type: mongoose_1.Schema.Types.String,
                required: false,
            },
            loginAttempts: {
                type: mongoose_1.Schema.Types.Number,
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
                type: mongoose_1.Schema.Types.String,
                required: true,
            },
            expiresAt: { type: mongoose_1.Schema.Types.Date, required: true },
            issuedAt: { type: mongoose_1.Schema.Types.Date, required: true },
        },
        _id: false,
        required: false,
    },
}, {
    versionKey: false,
    timestamps: true,
    collection: 'users',
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.__v;
            ret.id = ret._id;
            delete ret.otp;
            return ret;
        },
    },
});
schema.methods.getAuthInfo = function () {
    return {
        id: String(this._id),
        email: this.email,
        username: this.username,
        phone: this.phone,
        active: this.active,
        verified: this.verified,
        lock: this.lock,
    };
};
schema.index({ email: 1 }, { name: 'by_email', unique: true });
schema.index({ username: 1 }, { name: 'by_username', unique: true });
schema.index({ 'otp.code': 1 }, { name: 'by_otp_code', unique: true, partialFilterExpression: { 'otp.code': { $exists: true } }, sparse: true });
schema.index({ 'auth.refreshToken': 1 }, {
    name: 'by_refresh_token',
    unique: true,
    partialFilterExpression: { 'auth.refreshToken': { $exists: true } },
    sparse: true,
});
exports.User = (0, mongoose_1.model)('User', schema);
//# sourceMappingURL=User.js.map