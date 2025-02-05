import { RabbitMQClient } from '../../provider/RabbitMQClient';
import { Action } from '../../types/Action';
import { MessageQueue } from '../../utils/misc/MessageBroker';
import { BrokerMessageRequestBody } from '../../validation/message-broker/sample/BrokerRequest';

export class BrokerAction implements Action {
  constructor(private payload: BrokerMessageRequestBody) {}

  public async execute() {
    await RabbitMQClient.sendMessage<BrokerMessageRequestBody>(MessageQueue.SAMPLE_BROKER, {
      message: this.payload.message,
    });
  }
}
