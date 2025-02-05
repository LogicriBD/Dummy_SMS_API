import { RabbitMQClient } from '../../provider/RabbitMQClient';
import { SMSGateway } from '../../provider/SMSGateway';
import { Action } from '../../types/Action';
import { MessageQueue } from '../../utils/misc/MessageBroker';
import { BrokerMessageRequestBody } from '../../validation/message-broker/sample/BrokerRequest';
import { SMSRequestBody } from '../../validation/rest-api/sample/SMSRequest';

export class SMSAction implements Action {
  constructor(private payload: SMSRequestBody) {}

  public async execute() {
    const smsSent = await SMSGateway.sendSMS({
      ...this.payload,
    });
    if (!smsSent) {
      throw new Error('Failed to send SMS');
    }
    return smsSent;
  }
}
