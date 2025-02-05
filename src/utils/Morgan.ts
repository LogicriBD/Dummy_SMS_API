import { Request, Response } from 'express';
import morgan from 'morgan';
import { isDevelopmentEnvironment } from './Helper';

morgan.token('message', (req: Request, res: Response) => {
  const response = res as Response;
  const errorMessage = response.locals.errorMessage || 'No error message';
  return `${res.statusMessage} - ${errorMessage}`;
});

morgan.token('date-time', () => {
  const dateLocalString = new Date().toLocaleDateString();
  const timeLocalString = new Date().toLocaleTimeString();
  return `${dateLocalString}-${timeLocalString}`;
});

const getIpFormat = () => (!isDevelopmentEnvironment() ? ':remote-addr - ' : '');

export const successResponseFormat = `${getIpFormat()}:method :date-time :url :status - :response-time ms`;

export const errorResponseFormat = `${getIpFormat()}:method :date-time :url :status - :response-time ms - message: :message`;

export const Morgan = morgan;
