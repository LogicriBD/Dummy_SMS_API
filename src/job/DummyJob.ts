import { RabbitMQConsumer } from '../provider/RabbitMQClient';
import { BrokerMessageRequestBody } from '../validation/message-broker/sample/BrokerRequest';

export class DummyJob implements RabbitMQConsumer<BrokerMessageRequestBody> {
  async onMessage(payload: BrokerMessageRequestBody) {}
}
