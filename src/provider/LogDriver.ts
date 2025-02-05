import path from 'path';
import { Logger, transports, format } from 'winston';

export const logger = new Logger({
  format: format.combine(
    format.colorize(),
    format.json(),
    format.printf(
      (info) =>
        `${new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()} ${info.level}: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : ' '),
    ),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ level: 'error', filename: path.resolve(__dirname, '../../report/log/error.log') }),
    new transports.File({ level: 'info', filename: path.resolve(__dirname, '../../report/log/activity.log') }),
  ],
});
