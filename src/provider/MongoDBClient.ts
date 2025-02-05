import mongoose from 'mongoose';
import { log } from '../utils/Helper';

export class MongoDBClient {
  private static instance: MongoDBClient;

  static getInstance() {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }

    return MongoDBClient.instance;
  }

  registerEvents() {
    mongoose.set('strictQuery', true);
    mongoose.set('debug', false);
    mongoose.set('toJSON', {
      virtuals: true,
    });

    mongoose.connection.on('connected', () => {
      log('info', '✅ Mongoose connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      log('error', '⛔️ Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', () => {
      log('error', '🟠 Mongoose connection disconnected');
    });
  }

  getMongoURL() {
    return process.env.MONGO_URL as string;
  }

  async connect(onSuccess?: () => void) {
    const options = {
      autoIndex: true,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 300000,
      maxPoolSize: 5,
      minPoolSize: 2,
    };

    this.registerEvents();

    try {
      await mongoose.connect(this.getMongoURL(), options);
      onSuccess?.();
    } catch (error) {
      log('error', '⛔️ Mongoose database failed: ', error);
    }
  }
}
