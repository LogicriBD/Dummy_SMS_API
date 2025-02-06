"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortKiller = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const Helper_1 = require("../Helper");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
class PortKiller {
    constructor(port) {
        this.port = port;
    }
    async getProcessId() {
        var _a, _b;
        const isWin = process.platform === 'win32';
        const cmd = isWin ? `netstat -ano | findstr :${this.port}` : `lsof -i :${this.port} | grep LISTEN`;
        try {
            const { stdout } = await execPromise(cmd);
            if (!stdout)
                return null;
            const pid = isWin ? ((_a = stdout.trim().split(/\s+/).pop()) !== null && _a !== void 0 ? _a : null) : ((_b = stdout.trim().split(/\s+/)[1]) !== null && _b !== void 0 ? _b : null);
            return pid;
        }
        catch {
            return null;
        }
    }
    async killProcess() {
        try {
            const pid = await this.getProcessId();
            if (!pid) {
                (0, Helper_1.log)('error', `⛔️ No process found using port ${this.port}.`);
                return;
            }
            (0, Helper_1.log)('info', `⛔️ Killing process ${pid} on port ${this.port}...`);
            const isWin = process.platform === 'win32';
            const killCmd = isWin ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
            await execPromise(killCmd);
            (0, Helper_1.log)('info', `✅ Successfully killed process ${pid} on port ${this.port}.`);
        }
        catch (error) {
            (0, Helper_1.log)('error', `⛔️ Failed to kill process on port ${this.port}: ${error}`);
        }
    }
}
exports.PortKiller = PortKiller;
//# sourceMappingURL=PortKiller.js.map