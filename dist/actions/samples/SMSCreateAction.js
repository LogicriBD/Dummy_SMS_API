"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSCreateAction = void 0;
const http_status_codes_1 = require("http-status-codes");
const SMSRepository_1 = require("../../database/repository/SMSRepository");
const StorageService_1 = require("../../provider/StorageService");
const ApiError_1 = require("../../utils/ApiError");
class SMSCreateAction {
    constructor(payload, files) {
        this.payload = payload;
        this.files = files;
    }
    async execute() {
        var _a, _b;
        if (this.payload.MsgType === 'TEXT') {
            const newSMS = await SMSRepository_1.SMSRepository.saveSMS({
                receiver: this.payload.receiver,
                email: this.payload.userName,
                message: this.payload.message,
                type: this.payload.MsgType,
                masking: this.payload.masking,
                masked: Boolean((_a = this.payload.masking) === null || _a === void 0 ? void 0 : _a.length),
            });
            return newSMS;
        }
        else {
            if (!this.files || this.files.length === 0) {
                throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Media files are required for media type message');
            }
            const files = await Promise.all(this.files.map(async (file) => {
                const fileReference = await StorageService_1.StorageService.uploadFileFromPath({
                    keys: [StorageService_1.StorageFolder.media, file.path],
                });
                return fileReference;
            }));
            const newSMS = await SMSRepository_1.SMSRepository.saveSMS({
                receiver: this.payload.receiver,
                email: this.payload.userName,
                message: this.payload.message,
                type: this.payload.MsgType,
                masking: this.payload.masking,
                masked: Boolean((_b = this.payload.masking) === null || _b === void 0 ? void 0 : _b.length),
                media: files,
            });
            return newSMS;
        }
    }
}
exports.SMSCreateAction = SMSCreateAction;
//# sourceMappingURL=SMSCreateAction.js.map