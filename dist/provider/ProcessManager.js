"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessManager = exports.criticalErrorCodes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Helper_1 = require("../utils/Helper");
const SignalManager_1 = require("../utils/misc/SignalManager");
const PortKiller_1 = require("../utils/misc/PortKiller");
exports.criticalErrorCodes = ['ECONNREFUSED', 'EADDRINUSE', 'EPIPE', 'ENOMEM', 'CORS'];
class ProcessManager {
    constructor() {
        this.registerEvents();
    }
    static async getInstance(initialize) {
        if (!ProcessManager.instance) {
            ProcessManager.instance = new ProcessManager();
            ProcessManager.instance.server = (await initialize()).server;
        }
        else {
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
        process.on('uncaughtException', async (err) => {
            (0, Helper_1.log)('error', `⛔️ Uncaught Exception: ${JSON.stringify(err)}`);
            if (await this.isCriticalError(err)) {
                await this.shutdown(1);
            }
            else {
                (0, Helper_1.log)('warn', 'Non-critical exception. Continuing...');
            }
        });
    }
    handleUnhandledRejection() {
        process.on('unhandledRejection', async (reason, promise) => {
            (0, Helper_1.log)('error', `⛔️ Unhandled Rejection at: ${JSON.stringify(promise)}, reason: ${reason}`);
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
        SignalManager_1.SignalActions.forEach((signal) => {
            process.on(signal.code, async () => {
                (0, Helper_1.log)('info', `⛔️ ${signal.code}: Received ${signal.message}`);
                switch (signal.action) {
                    case 'shutdown':
                        await this.shutdown(0);
                        break;
                    case 'log':
                        (0, Helper_1.log)('info', `💫 LOG: Received ${signal.message}`);
                        // Consider alerting a monitoring system like Sentry
                        // sendAlert('LOG', { code, message });
                        break;
                }
            });
        });
    }
    async isCriticalError(error) {
        if (!error)
            return false;
        if (error.code === 'EADDRINUSE' && process.env.HTTP_PORT && process.env.NODE_ENV === 'development') {
            const portKiller = new PortKiller_1.PortKiller(Number(process.env.HTTP_PORT));
            await portKiller.killProcess();
        }
        if (error.code && exports.criticalErrorCodes.includes(error.code)) {
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
    async shutdown(returnCode) {
        var _a;
        console.log('🔌 Shutting down gracefully');
        await mongoose_1.default.connection.close(true);
        await ((_a = this.server) === null || _a === void 0 ? void 0 : _a.close(() => {
            console.log('✅ HTTP server closed');
        }));
        process.exit(returnCode);
    }
}
exports.ProcessManager = ProcessManager;
//# sourceMappingURL=ProcessManager.js.map