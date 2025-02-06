"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMultipleFiles = exports.withSingleFile = void 0;
const crypto_1 = require("crypto");
const http_status_codes_1 = require("http-status-codes");
const multer_1 = __importDefault(require("multer"));
const ApiError_1 = require("../utils/ApiError");
const localFileUploadStorage = multer_1.default.diskStorage({
    destination: 'upload',
    filename(req, file, callback) {
        const extension = file.originalname.split('.').pop();
        const uuid = (0, crypto_1.randomBytes)(12).toString('hex');
        const fileName = `file-${uuid}.${extension}`;
        callback(null, fileName);
    },
});
const createFileFilter = (allowedMimeTypes) => {
    return (req, file, callback) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, `${file.mimetype} file type is not allowed, please upload a file of type ${allowedMimeTypes.join(', ')}`));
        }
    };
};
const withSingleFile = (name, allowedMimeTypes) => (0, multer_1.default)({
    limits: { fileSize: 500 * 1024 * 1024 },
    storage: localFileUploadStorage,
    fileFilter: allowedMimeTypes ? createFileFilter(allowedMimeTypes) : undefined,
}).single(name);
exports.withSingleFile = withSingleFile;
const withMultipleFiles = (name, allowedMimeTypes) => (0, multer_1.default)({
    limits: { fileSize: 500 * 1024 * 1024 },
    storage: localFileUploadStorage,
    fileFilter: allowedMimeTypes ? createFileFilter(allowedMimeTypes) : undefined,
}).array(name);
exports.withMultipleFiles = withMultipleFiles;
//# sourceMappingURL=CaptureUploadedFile.js.map