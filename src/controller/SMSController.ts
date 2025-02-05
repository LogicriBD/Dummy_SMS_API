import { NextFunction, Request, Response } from 'express';
import { Controller, GET, POST } from '../types/Controller';
import { SMSCreateAction } from '../actions/samples/SMSCreateAction';
import {
  multimediaSMSRequestValidator,
  SMSRequestBody,
  SMSRequestParams,
  textSMSRequestValidator,
} from '../validation/sms/SMSRequest';
import { withMultipleFiles } from '../middleware/CaptureUploadedFile';
import { SMSFetchAction } from '../actions/samples/SMSFetchAction';
import { FetchSMSParams, fetchSMSValidator } from '../validation/sms/FetchSMSRequest';

@Controller
export class SMSController {
  @GET('/send-text/:userName/:password/:MsgType/:masking/:receiver/:message', [textSMSRequestValidator])
  public async sendSMS(req: Request<SMSRequestParams>, res: Response, next: NextFunction) {
    try {
      const smsAction = new SMSCreateAction(req.params);
      const response = await smsAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/send-multimedia', [withMultipleFiles('media'), multimediaSMSRequestValidator])
  public async sendMultimediaSMS(req: Request<SMSRequestBody>, res: Response, next: NextFunction) {
    try {
      const smsAction = new SMSCreateAction(req.body, req.files as Express.Multer.File[]);
      const response = await smsAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @GET('/fetch', [fetchSMSValidator])
  public async fetchSMS(req: Request<unknown, unknown, unknown, FetchSMSParams>, res: Response, next: NextFunction) {
    try {
      const smsAction = new SMSFetchAction(req.query);
      const response = await smsAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
