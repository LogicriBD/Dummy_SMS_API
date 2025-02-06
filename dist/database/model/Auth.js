"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = void 0;
const mongoose_1 = require("mongoose");
const AuthToken_1 = require("../../types/enums/AuthToken");
const schema = new mongoose_1.Schema({
    user: {
        _id: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        email: {
            type: mongoose_1.Schema.Types.String,
            required: true,
            trim: true,
        },
        username: {
            type: mongoose_1.Schema.Types.String,
            required: true,
            trim: true,
        },
    },
    token: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        trim: true,
    },
    type: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        trim: true,
        enum: AuthToken_1.allTokenTypes,
    },
    expires: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
    },
    blacklisted: {
        type: mongoose_1.Schema.Types.Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        default: Date.now,
    },
}, {
    collection: 'auth_tokens',
    versionKey: false,
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
schema.index({ 'user._id': 1, token: 1, type: 1 }, { name: 'by_user.id_token_type', unique: true });
exports.AuthToken = (0, mongoose_1.model)('Auth_Token', schema);
//# sourceMappingURL=Auth.js.map