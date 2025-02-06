"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteFileReferenceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.remoteFileReferenceSchema = new mongoose_1.Schema({
    originalName: mongoose_1.Schema.Types.String,
    downloadUrl: mongoose_1.Schema.Types.String,
    mimeType: mongoose_1.Schema.Types.String,
    visibility: {
        type: mongoose_1.Schema.Types.String,
        enum: ['public', 'private'],
        required: false,
        default: 'public',
    },
}, {
    _id: false,
    versionKey: false,
    timestamps: false,
});
//# sourceMappingURL=RemoteFileReference.js.map