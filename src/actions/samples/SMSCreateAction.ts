import { StatusCodes } from 'http-status-codes';
import { SMSRepository } from '../../database/repository/SMSRepository';
import { StorageFolder, StorageService } from '../../provider/StorageService';
import { Action } from '../../types/Action';
import { ApiError } from '../../utils/ApiError';
import { SMSRequestBody } from '../../validation/sms/SMSRequest';

export class SMSCreateAction implements Action {
  constructor(
    private payload: SMSRequestBody,
    private files?: Express.Multer.File[],
  ) {}

  public async execute() {
    if (this.payload.MsgType === 'TEXT') {
      const newSMS = await SMSRepository.saveSMS({
        receiver: this.payload.receiver,
        email: this.payload.userName,
        message: this.payload.message,
        type: this.payload.MsgType,
        masking: this.payload.masking,
        masked: Boolean(this.payload.masking?.length),
      });

      return newSMS;
    } else {
      if (!this.files || this.files.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Media files are required for media type message');
      }
      const files = await Promise.all(
        this.files.map(async (file) => {
          const fileReference = await StorageService.uploadFileFromPath({
            keys: [StorageFolder.media, file.path],
          });
          return fileReference;
        }),
      );
      const newSMS = await SMSRepository.saveSMS({
        receiver: this.payload.receiver,
        email: this.payload.userName,
        message: this.payload.message,
        type: this.payload.MsgType,
        masking: this.payload.masking,
        masked: Boolean(this.payload.masking?.length),
        media: files,
      });
      return newSMS;
    }
  }
}
