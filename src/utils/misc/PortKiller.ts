import { exec } from 'child_process';
import { promisify } from 'util';
import { log } from '../Helper';

const execPromise = promisify(exec);

export class PortKiller {
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  private async getProcessId(): Promise<string | null> {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? `netstat -ano | findstr :${this.port}` : `lsof -i :${this.port} | grep LISTEN`;

    try {
      const { stdout } = await execPromise(cmd);
      if (!stdout) return null;

      const pid = isWin ? (stdout.trim().split(/\s+/).pop() ?? null) : (stdout.trim().split(/\s+/)[1] ?? null);

      return pid;
    } catch {
      return null;
    }
  }

  public async killProcess(): Promise<void> {
    try {
      const pid = await this.getProcessId();

      if (!pid) {
        log('error', `⛔️ No process found using port ${this.port}.`);
        return;
      }

      log('info', `⛔️ Killing process ${pid} on port ${this.port}...`);
      const isWin = process.platform === 'win32';
      const killCmd = isWin ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;

      await execPromise(killCmd);
      log('info', `✅ Successfully killed process ${pid} on port ${this.port}.`);
    } catch (error) {
      log('error', `⛔️ Failed to kill process on port ${this.port}: ${error}`);
    }
  }
}
