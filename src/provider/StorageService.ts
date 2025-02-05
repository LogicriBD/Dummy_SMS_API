import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import mime from 'mime-types';
import path from 'path';
import { Readable } from 'stream';
import { RemoteFileReference } from '../types/Misc';
import { ApiError } from '../utils/ApiError';
import { getLocalFileSizeInBytes, log } from '../utils/Helper';

export const StorageFolder = {
  user: 'user',
  product: 'product',
  receipts: 'receipts',
  invoices: 'invoices',
  reports: 'reports',
};

export type FileUploadOptions = {
  keys: string[];
};

export type FileDeleteOptions = {
  urlOrKey: string;
};

export type FileDownloadOptions = {
  url: string;
  downloadFolder: string;
};

export type BufferedFileUploadOptions = FileUploadOptions & { content: Buffer };

class StorageServiceImpl {
  private disk: S3Client;

  constructor() {
    this.disk = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  getURLOfS3Object(fileKey: string) {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  async getPreSignedURLForUpload(fileKey: string) {
    const command = new PutObjectCommand({
      Key: fileKey,
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: mime.lookup(fileKey).toString(),
    });

    const options = {
      expiresIn: 10 * 60, // 5 Minutes
    };
    return await getSignedUrl(this.disk, command, options);
  }

  async getPreSignedURLForDownload(fileKey: string) {
    fileKey = this.getObjectKeyFrom(fileKey);
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    const options = {
      expiresIn: 30 * 60, // 30 Minutes
    };
    return await getSignedUrl(this.disk, command, options);
  }

  private getObjectKeyFrom(urlOrKey: string) {
    if (!urlOrKey.startsWith('https://')) {
      return urlOrKey;
    }

    const url = new URL(urlOrKey);
    const pathParts = url.pathname.substring(1).split('/');
    return pathParts.join('/');
  }

  async downloadFile(options: FileDownloadOptions) {
    try {
      const fileKey = this.getObjectKeyFrom(options.url);
      const fileName = path.basename(fileKey);
      const filePath = path.join(options.downloadFolder, fileName);

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      });
      const { Body } = await this.disk.send(command);

      if (!Body || !(Body instanceof Readable)) {
        throw new Error(`Invalid response body from S3: ${options}`);
      }

      if (fs.existsSync(options.downloadFolder)) {
        await fs.promises.mkdir(options.downloadFolder, { recursive: true });
      }

      return new Promise<string>((resolve, reject) => {
        Body.pipe(fs.createWriteStream(filePath))
          .on('error', (err) => reject(err))
          .on('close', () => resolve(filePath));
      });
    } catch (error) {
      log('error', 'File download failed: ', error);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `File download failed:: ${options.url}`);
    }
  }

  async uploadFile(options: BufferedFileUploadOptions): Promise<RemoteFileReference | null> {
    try {
      const fileKey = `${process.env.AWS_DEFAULT_FOLDER!}/${options.keys.join('/')}`;
      const uploadParams: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: options.content,
      };

      await this.disk.send(new PutObjectCommand(uploadParams));
      return {
        mimeType: '',
        originalName: '',
        downloadUrl: this.getURLOfS3Object(fileKey),
      };
    } catch (error) {
      return null;
    }
  }

  async uploadFileFromPath(options: FileUploadOptions): Promise<RemoteFileReference> {
    try {
      if (!options.keys.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'File upload failed, file path not specified');
      }

      const filePath = options.keys[options.keys.length - 1];
      const fileName = path.basename(filePath);
      const fileKey = [process.env.AWS_DEFAULT_FOLDER!, ...options.keys.slice(0, -1), fileName].join('/');

      const uploadParams: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: fs.readFileSync(filePath),
        ContentType: mime.lookup(filePath).toString(),
      };

      await this.disk.send(new PutObjectCommand(uploadParams));
      return {
        originalName: fileName,
        mimeType: mime.lookup(filePath).toString(),
        downloadUrl: this.getURLOfS3Object(fileKey),
        sizeInBytes: await getLocalFileSizeInBytes(filePath),
      };
    } catch (error: any) {
      log('error', 'S3 upload error: ' + error.message);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to upload file, please try again');
    }
  }

  async deleteFile(options: FileDeleteOptions) {
    try {
      const fileKey = this.getObjectKeyFrom(options.urlOrKey);
      const deleteParams: DeleteObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
      };

      return await this.disk.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      log('error', 'S3 delete error: ', error);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete file, please try again');
    }
  }
}

export const StorageService = new StorageServiceImpl();
