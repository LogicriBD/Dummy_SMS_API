"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS = exports.allMessageTypes = exports.messageTypes = void 0;
const mongoose_1 = require("mongoose");
const RemoteFileReference_1 = require("../subdocuments/RemoteFileReference");
exports.messageTypes = {
    TEXT: 'TEXT',
    MULTIMEDIA: 'MULTIMEDIA',
};
exports.allMessageTypes = ['TEXT', 'MULTIMEDIA'];
const schema = new mongoose_1.Schema({
    email: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        trim: true,
    },
    masking: {
        type: mongoose_1.Schema.Types.String,
        required: false,
        trim: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        trim: true,
    },
    type: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        enum: exports.allMessageTypes,
        default: 'TEXT',
    },
    message: {
        type: mongoose_1.Schema.Types.String,
        required: false,
        trim: true,
    },
    media: {
        type: [RemoteFileReference_1.remoteFileReferenceSchema],
        required: false,
    },
    masked: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
    },
    read: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
    },
}, {
    collection: 'sms',
    versionKey: false,
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
schema.index({ receiver: 1, createdAt: -1 }, {
    name: 'by_receiver',
    sparse: true,
});
exports.SMS = (0, mongoose_1.model)('SMS', schema);
//# sourceMappingURL=SMS.js.map