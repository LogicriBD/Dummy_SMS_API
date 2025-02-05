import amqplib, { Channel, Connection } from 'amqplib';
import { log } from '../utils/Helper';
import { MessageQueue, MessageQueueOptions } from '../utils/misc/MessageBroker';

export interface RabbitMQConsumer<T> {
  onMessage: (payload: T) => Promise<void>;
}

class RabbitMQService {
  private connection?: Connection;
  private channel?: Channel;
  private isConnected: boolean = false;

  async connect() {
    if (this.isConnected && this.channel) {
      return;
    }

    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL!);
      this.channel = await this.connection.createChannel();
      this.isConnected = true;

      log('info', '✅ RabbitMQ Connection is ready');
    } catch (error) {
      this.isConnected = false;
      log('error', '⛔️ RabbitMQ connection failed', error);
    }
  }

  async disconnect() {
    if (this.isConnected && this.channel) {
      await this.channel.close();
      await this.connection?.close();
      this.isConnected = false;

      log('warn', '🟠 RabbitMQ connection closed');
    }
  }

  async sendMessage<T = any>(queuePrefix: string, message: T) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const queue = this.toEnvSpecificQueueName(queuePrefix);
      await this.channel?.assertQueue(queue, { durable: true });
      this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });

      log('info', '🚀 RabbitMQ message sent', { queue, message });
    } catch (error) {
      log('error', '🟠 RabbitMQ message sending failed', error);
    }
  }

  toEnvSpecificQueueName(queue: string) {
    return `${queue}::${process.env.NODE_ENV}`;
  }

  async consumeMessage<T = any>(
    queuePrefix: MessageQueue,
    callback: RabbitMQConsumer<T>['onMessage'],
    validator: (payload: T) => T,
    options?: MessageQueueOptions,
  ) {
    if (!this.channel) {
      await this.connect();
    }

    const queue = this.toEnvSpecificQueueName(queuePrefix);

    await this.channel?.assertQueue(queue, { durable: true });
    if (options?.limit) {
      this.channel?.prefetch(options.limit);
    }

    this.channel?.consume(
      queue,
      async (message) => {
        if (!message) {
          log('error', '🟠 RabbitMQ invalid message', { message });
          return;
        }

        const padding = message.content.toString('utf8').length > 100 ? '...' : '';

        log('info', '💫 RabbitMQ message received', {
          queue,
          message: message.content.toString('utf8').slice(0, 100) + padding,
        });

        try {
          const payload = validator(JSON.parse(message.content.toString('utf8')));
          await callback(payload);
        } catch (error: any) {
          log('error', `⛔️ RabbitMQ consumer error ${JSON.stringify({ queue, error: error.message })}`);
        } finally {
          this.channel?.ack(message);
        }
      },
      {
        noAck: false,
      },
    );
  }
}

export const RabbitMQClient = new RabbitMQService();
