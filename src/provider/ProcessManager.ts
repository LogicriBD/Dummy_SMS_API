import mongoose from 'mongoose';
import { log } from '../utils/Helper';
import { SignalActions } from '../utils/misc/SignalManager';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { PortKiller } from '../utils/misc/PortKiller';

export const criticalErrorCodes = ['ECONNREFUSED', 'EADDRINUSE', 'EPIPE', 'ENOMEM', 'CORS'];

export class ProcessManager {
  private static instance: ProcessManager;
  private server?: Server<typeof IncomingMessage, typeof ServerResponse>;

  private constructor() {
    this.registerEvents();
  }

  static async getInstance(
    initialize: () => Promise<{
      server: Server<typeof IncomingMessage, typeof ServerResponse>;
    }>,
  ) {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager();
      ProcessManager.instance.server = (await initialize()).server;
    } else {
      ProcessManager.instance.server = (await initialize()).server;
      return ProcessManager.instance;
    }
  }

  registerEvents() {
    this.handleUncaughtException();
    this.handleUnhandledRejection();
    this.handleSignals();
  }

  handleUncaughtException() {
    process.on('uncaughtException', async (err: any) => {
      log('error', `⛔️ Uncaught Exception: ${JSON.stringify(err)}`);

      if (await this.isCriticalError(err)) {
        await this.shutdown(1);
      } else {
        log('warn', 'Non-critical exception. Continuing...');
      }
    });
  }

  handleUnhandledRejection() {
    process.on('unhandledRejection', async (reason, promise) => {
      log('error', `⛔️ Unhandled Rejection at: ${JSON.stringify(promise)}, reason: ${reason}`);

      if (process.env.NODE_ENV === 'production') {
        // Consider alerting a monitoring system like Sentry
        // sendAlert('Unhandled Rejection', { reason, promise });
      }

      if (await this.isCriticalError(reason)) {
        await this.shutdown(1);
      }
    });
  }

  handleSignals() {
    SignalActions.forEach((signal) => {
      process.on(signal.code, async () => {
        log('info', `⛔️ ${signal.code}: Received ${signal.message}`);
        switch (signal.action) {
          case 'shutdown':
            await this.shutdown(0);
            break;
          case 'log':
            log('info', `💫 LOG: Received ${signal.message}`);
            // Consider alerting a monitoring system like Sentry
            // sendAlert('LOG', { code, message });
            break;
        }
      });
    });
  }

  private async isCriticalError(error: any) {
    if (!error) return false;
    if (error.code === 'EADDRINUSE' && process.env.HTTP_PORT && process.env.NODE_ENV === 'development') {
      const portKiller = new PortKiller(Number(process.env.HTTP_PORT!));
      await portKiller.killProcess();
    }
    if (error.code && criticalErrorCodes.includes(error.code)) {
      return true;
    }

    if (error.status && error.status > 500) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param returnCode 0 for success, 1 for failure
   */
  async shutdown(returnCode: 0 | 1) {
    console.log('🔌 Shutting down gracefully');
    await mongoose.connection.close(true);
    await this.server?.close(() => {
      console.log('✅ HTTP server closed');
    });
    process.exit(returnCode);
  }
}
