"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config();
const EventBus_1 = require("./provider/EventBus");
const HttpServer_1 = require("./provider/HttpServer");
const JobScheduler_1 = require("./provider/JobScheduler");
const Helper_1 = require("./utils/Helper");
const DummyAccountSeeder_1 = require("./database/seeder/DummyAccountSeeder");
const MongoDBClient_1 = require("./provider/MongoDBClient");
const ProcessManager_1 = require("./provider/ProcessManager");
const initialize = async () => {
    MongoDBClient_1.MongoDBClient.getInstance().connect(async () => {
        await new DummyAccountSeeder_1.DummyAccountSeeder().seed();
    });
    (0, JobScheduler_1.registerScheduledJobs)();
    (0, EventBus_1.registerGlobalEventListeners)();
    return {
        server: HttpServer_1.HttpServer.listen(process.env.HTTP_PORT, () => {
            const port = process.env.HTTP_PORT;
            const env = process.env.NODE_ENV;
            const version = process.env.npm_package_version;
            (0, Helper_1.log)('info', `✅ HTTP server is running on port: ${port} | env: ${env} | version: ${version}`);
        }),
    };
};
ProcessManager_1.ProcessManager.getInstance(initialize);
//# sourceMappingURL=app.js.map