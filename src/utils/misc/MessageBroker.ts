import { DummyJob } from '../../job/DummyJob';
import { RabbitMQClient, RabbitMQConsumer } from '../../provider/RabbitMQClient';
import { brokerMessageValidator } from '../../validation/message-broker/sample/BrokerRequest';

export const MessageQueue = {
  SAMPLE_BROKER: 'sample-broker',
} as const;

export type MessageQueue = (typeof MessageQueue)[keyof typeof MessageQueue];

export type MessageQueueOptions = {
  limit?: number;
  persistent?: boolean;
};

type RegisteredConsumer = {
  queue: MessageQueue;
  consumer: RabbitMQConsumer<any>;
  validator: (payload: any) => any;
  options?: MessageQueueOptions;
};

export const registerMessageQueueConsumers = async () => {
  const registrations: RegisteredConsumer[] = [
    {
      queue: MessageQueue.SAMPLE_BROKER,
      consumer: new DummyJob(),
      validator: brokerMessageValidator,
    },
  ];

  for (const item of registrations) {
    await RabbitMQClient.consumeMessage(
      item.queue,
      item.consumer.onMessage.bind(item.consumer),
      item.validator,
      item.options,
    );
  }
};
