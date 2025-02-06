"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = exports.StorageFolder = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const ApiError_1 = require("../utils/ApiError");
const Helper_1 = require("../utils/Helper");
exports.StorageFolder = {
    user: 'user',
    product: 'product',
    receipts: 'receipts',
    invoices: 'invoices',
    reports: 'reports',
    media: 'media',
};
class StorageServiceImpl {
    constructor() {
        this.disk = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    getURLOfS3Object(fileKey) {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }
    async getPreSignedURLForUpload(fileKey) {
        const command = new client_s3_1.PutObjectCommand({
            Key: fileKey,
            Bucket: process.env.AWS_BUCKET_NAME,
            ContentType: mime_types_1.default.lookup(fileKey).toString(),
        });
        const options = {
            expiresIn: 10 * 60, // 5 Minutes
        };
        return await (0, s3_request_presigner_1.getSignedUrl)(this.disk, command, options);
    }
    async getPreSignedURLForDownload(fileKey) {
        fileKey = this.getObjectKeyFrom(fileKey);
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        });
        const options = {
            expiresIn: 30 * 60, // 30 Minutes
        };
        return await (0, s3_request_presigner_1.getSignedUrl)(this.disk, command, {
            ...options,
        });
    }
    getObjectKeyFrom(urlOrKey) {
        if (!urlOrKey.startsWith('https://')) {
            return urlOrKey;
        }
        const url = new URL(urlOrKey);
        const pathParts = url.pathname.substring(1).split('/');
        return pathParts.join('/');
    }
    async downloadFile(options) {
        try {
            const fileKey = this.getObjectKeyFrom(options.url);
            const fileName = path_1.default.basename(fileKey);
            const filePath = path_1.default.join(options.downloadFolder, fileName);
            const command = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
            });
            const { Body } = await this.disk.send(command);
            if (!Body || !(Body instanceof stream_1.Readable)) {
                throw new Error(`Invalid response body from S3: ${options}`);
            }
            if (fs_1.default.existsSync(options.downloadFolder)) {
                await fs_1.default.promises.mkdir(options.downloadFolder, { recursive: true });
            }
            return new Promise((resolve, reject) => {
                Body.pipe(fs_1.default.createWriteStream(filePath))
                    .on('error', (err) => reject(err))
                    .on('close', () => resolve(filePath));
            });
        }
        catch (error) {
            (0, Helper_1.log)('error', 'File download failed: ', error);
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `File download failed:: ${options.url}`);
        }
    }
    async uploadFile(options) {
        try {
            const fileKey = `${process.env.AWS_DEFAULT_FOLDER}/${options.keys.join('/')}`;
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: options.content,
            };
            await this.disk.send(new client_s3_1.PutObjectCommand(uploadParams));
            return {
                mimeType: '',
                originalName: '',
                downloadUrl: this.getURLOfS3Object(fileKey),
            };
        }
        catch (error) {
            return null;
        }
    }
    async uploadFileFromPath(options) {
        try {
            if (!options.keys.length) {
                throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'File upload failed, file path not specified');
            }
            const filePath = options.keys[options.keys.length - 1];
            const fileName = path_1.default.basename(filePath);
            const fileKey = [process.env.AWS_DEFAULT_FOLDER, ...options.keys.slice(0, -1), fileName].join('/');
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: fs_1.default.readFileSync(filePath),
                ContentType: mime_types_1.default.lookup(filePath).toString(),
            };
            await this.disk.send(new client_s3_1.PutObjectCommand(uploadParams));
            return {
                originalName: fileName,
                mimeType: mime_types_1.default.lookup(filePath).toString(),
                downloadUrl: this.getURLOfS3Object(fileKey),
                sizeInBytes: await (0, Helper_1.getLocalFileSizeInBytes)(filePath),
            };
        }
        catch (error) {
            (0, Helper_1.log)('error', 'S3 upload error: ' + error.message);
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to upload file, please try again');
        }
    }
    async deleteFile(options) {
        try {
            const fileKey = this.getObjectKeyFrom(options.urlOrKey);
            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
            };
            return await this.disk.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        }
        catch (error) {
            (0, Helper_1.log)('error', 'S3 delete error: ', error);
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete file, please try again');
        }
    }
}
exports.StorageService = new StorageServiceImpl();
//# sourceMappingURL=StorageService.js.map