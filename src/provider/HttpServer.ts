import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import helmet from 'helmet';

import { authenticateUser } from '../middleware/AuthenticateUser';
import { preventLockedUserAccess } from '../middleware/PreventLockedUserAccess';
import { processUncaughtException } from '../middleware/ProcessUncaughtException';
import { resolveApplicationError } from '../middleware/ResolveApplicationError';
import { notFoundRoute } from '../middleware/NotFoundRoute';
import { ExpressRouter } from '../utils/misc/ExpressRouter';
import { loggingMiddleware } from '../middleware/RequestLogger';
import path from 'path';

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);
app.set('views', path.join(__dirname, '../', 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", process.env.API_URL!],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
ExpressRouter.initializeRoutes();
app.use(loggingMiddleware);
app.use(notFoundRoute);
app.use(authenticateUser);
app.use(preventLockedUserAccess);

app.use(ExpressRouter.getRouter());
app.set('trust proxy', true);
app.use(processUncaughtException);
app.use(resolveApplicationError);

export const HttpServer = app;
