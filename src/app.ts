import 'reflect-metadata';
require('dotenv').config();

import { registerGlobalEventListeners } from './provider/EventBus';
import { HttpServer } from './provider/HttpServer';
import { registerScheduledJobs } from './provider/JobScheduler';
import { log } from './utils/Helper';
import { DummyAccountSeeder } from './database/seeder/DummyAccountSeeder';
import { MongoDBClient } from './provider/MongoDBClient';
import { ProcessManager } from './provider/ProcessManager';

const initialize = async () => {
  MongoDBClient.getInstance().connect(async () => {
    await new DummyAccountSeeder().seed();
  });

  registerScheduledJobs();
  registerGlobalEventListeners();

  return {
    server: HttpServer.listen(process.env.HTTP_PORT, () => {
      const port = process.env.HTTP_PORT;
      const env = process.env.NODE_ENV;
      const version = process.env.npm_package_version;
      log('info', `✅ HTTP server is running on port: ${port} | env: ${env} | version: ${version}`);
    }),
  };
};

ProcessManager.getInstance(initialize);
