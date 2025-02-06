"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Helper_1 = require("../utils/Helper");
class MongoDBClient {
    static getInstance() {
        if (!MongoDBClient.instance) {
            MongoDBClient.instance = new MongoDBClient();
        }
        return MongoDBClient.instance;
    }
    registerEvents() {
        mongoose_1.default.set('strictQuery', true);
        mongoose_1.default.set('debug', false);
        mongoose_1.default.set('toJSON', {
            virtuals: true,
        });
        mongoose_1.default.connection.on('connected', () => {
            (0, Helper_1.log)('info', '✅ Mongoose connected successfully');
        });
        mongoose_1.default.connection.on('error', (err) => {
            (0, Helper_1.log)('error', '⛔️ Mongoose connection error: ' + err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            (0, Helper_1.log)('error', '🟠 Mongoose connection disconnected');
        });
    }
    getMongoURL() {
        return process.env.MONGO_URL;
    }
    async connect(onSuccess) {
        const options = {
            autoIndex: true,
            connectTimeoutMS: 60000,
            socketTimeoutMS: 300000,
            maxPoolSize: 5,
            minPoolSize: 2,
        };
        this.registerEvents();
        try {
            await mongoose_1.default.connect(this.getMongoURL(), options);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (error) {
            (0, Helper_1.log)('error', '⛔️ Mongoose database failed: ', error);
        }
    }
}
exports.MongoDBClient = MongoDBClient;
//# sourceMappingURL=MongoDBClient.js.map