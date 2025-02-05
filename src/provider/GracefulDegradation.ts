import mongoose from 'mongoose';
import { log } from '../utils/Helper';
import { SignalActions } from '../utils/misc/SignalManager';
import { RabbitMQClient } from './RabbitMQClient';
import { IncomingMessage, Server, ServerResponse } from 'http';

export const criticalErrorCodes = ['ECONNREFUSED', 'EADDRINUSE', 'EPIPE', 'ENOMEM', 'CORS'];

export class GracefulDegradation {
  private static instance: GracefulDegradation;
  private server?: Server<typeof IncomingMessage, typeof ServerResponse>;

  private constructor() {
    this.registerEvents();
  }

  static async getInstance(
    initialize: () => Promise<{
      server: Server<typeof IncomingMessage, typeof ServerResponse>;
    }>,
  ) {
    if (!GracefulDegradation.instance) {
      GracefulDegradation.instance = new GracefulDegradation();
      GracefulDegradation.instance.server = (await initialize()).server;
    } else {
      GracefulDegradation.instance.server = (await initialize()).server;
      return GracefulDegradation.instance;
    }
  }

  registerEvents() {
    this.handleUncaughtException();
    this.handleUnhandledRejection();
    this.handleSignals();
  }

  handleUncaughtException() {
    process.on('uncaughtException', (err: any) => {
      log('error', `Uncaught Exception: ${JSON.stringify(err)}`);

      if (this.isCriticalError(err)) {
        this.shutdown(() => process.exit(1));
      } else {
        log('warn', 'Non-critical exception. Continuing...');
      }
    });
  }

  handleUnhandledRejection() {
    process.on('unhandledRejection', (reason, promise) => {
      log('error', `Unhandled Rejection at: ${JSON.stringify(promise)}, reason: ${reason}`);

      if (process.env.NODE_ENV === 'production') {
        // Consider alerting a monitoring system like Sentry
        // sendAlert('Unhandled Rejection', { reason, promise });
      }

      if (this.isCriticalError(reason)) {
        this.shutdown(() => process.exit(1));
      }
    });
  }

  handleSignals() {
    SignalActions.forEach((signal) => {
      process.on(signal.code, async () => {
        switch (signal.action) {
          case 'shutdown':
            log('info', `${signal.code}: Received ${signal.message}`);
            await this.shutdown(() => process.exit(0));
            break;
          case 'log':
            log('info', `LOG: Received ${signal.message}`);
            // Consider alerting a monitoring system like Sentry
            // sendAlert('LOG', { code, message });
            break;
        }
      });
    });
  }

  private isCriticalError(error: any) {
    if (!error) return false;
    if (error.code && criticalErrorCodes.includes(error.code)) {
      return true;
    }

    if (error.status && error.status >= 500) {
      return true;
    }
    return false;
  }

  async shutdown(callback: () => void) {
    log('info', '🔌 Shutting down gracefully');
    await RabbitMQClient.disconnect();
    log('info', '🔌 RabbitMQ connection closed');
    await mongoose.connection.close(true);
    log('warn', '🔌 MongoDB connection closed');
    this.server?.close(() => {
      log('info', '✅ HTTP server closed');
      callback();
    });
    callback();
  }
}
