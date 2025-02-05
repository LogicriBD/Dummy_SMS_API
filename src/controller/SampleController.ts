import { NextFunction, Request, Response } from 'express';
import { Controller, POST } from '../types/Controller';
import { BrokerAction } from '../actions/samples/BrokerAction';
import { BrokerMessageRequestBody, brokerMessageValidator } from '../validation/rest-api/sample/BrokerRequest';
import { SMSAction } from '../actions/samples/SMSAction';
import { SMSRequestBody, smsRequestValidator } from '../validation/rest-api/sample/SMSRequest';

@Controller
export class SampleController {
  @POST('/sms', [smsRequestValidator])
  public async sendSMS(req: Request<unknown, unknown, SMSRequestBody>, res: Response, next: NextFunction) {
    try {
      const currentUser = new SMSAction(req.body);
      const response = await currentUser.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/broker', [brokerMessageValidator])
  public async broker(req: Request<unknown, unknown, BrokerMessageRequestBody>, res: Response, next: NextFunction) {
    try {
      const brokerAction = new BrokerAction(req.body);
      const response = await brokerAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
