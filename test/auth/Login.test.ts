import supertest from 'supertest';
import { HttpServer } from '../../src/provider/HttpServer';
import { MongoDBClient } from '../../src/provider/MongoDBClient';
import mongoose from 'mongoose';
import { credentials } from '../Helper';

describe('Login API', () => {
  beforeAll(async () => {
    await MongoDBClient.getInstance().connect();
  });

  it('should login user successfully', async () => {
    const res = await supertest(HttpServer).post('/auth/login').send({
      email: credentials.Admin.email,
      password: credentials.Admin.password,
    });
    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
