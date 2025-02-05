import supertest from 'supertest';
import { HttpServer } from '../../src/provider/HttpServer';
import { MongoDBClient } from '../../src/provider/MongoDBClient';
import mongoose from 'mongoose';
import { credentials, getAuthTokenFor } from '../Helper';
import { UserType } from '../../src/types/enums/User';

describe('Fetch Current User API', () => {
  beforeAll(async () => {
    await MongoDBClient.getInstance().connect();
  });

  it('should fetch current user successfully', async () => {
    const res = await supertest(HttpServer)
      .get('/user/fetch')
      .set('Authorization', await getAuthTokenFor(UserType.SYSTEM_ADMIN));
    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
