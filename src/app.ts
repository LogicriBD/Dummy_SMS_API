import 'reflect-metadata';
require('dotenv').config();

import { registerGlobalEventListeners } from './provider/EventBus';
import { HttpServer } from './provider/HttpServer';
import { registerScheduledJobs } from './provider/JobScheduler';
import { RabbitMQClient } from './provider/RabbitMQClient';
import { log } from './utils/Helper';
import { registerMessageQueueConsumers } from './utils/misc/MessageBroker';
import { SystemAdminAccountSeeder } from './database/seeder/SystemAdminAccountSeeder';
import { MongoDBClient } from './provider/MongoDBClient';
import { ProcessManager } from './provider/ProcessManager';

const initialize = async () => {
  MongoDBClient.getInstance().connect(async () => {
    await new SystemAdminAccountSeeder().seed();
  });
  await RabbitMQClient.connect();

  registerScheduledJobs();
  registerGlobalEventListeners();
  await registerMessageQueueConsumers();

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
