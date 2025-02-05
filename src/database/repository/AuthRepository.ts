import { StatusCodes } from 'http-status-codes';
import { TokenType } from '../../types/enums/AuthToken';
import { ApiError } from '../../utils/ApiError';
import { toMongoID } from '../../utils/Helper';
import { AuthToken } from '../model/Auth';
import { CreateAuthTokenPayload, UpdateAuthTokenPayload } from '../../types/dto/AuthToken';

class AuthRepositoryImpl {
  async insertOne(payload: CreateAuthTokenPayload) {
    return await AuthToken.create(payload);
  }

  async findById(id: string) {
    return await AuthToken.findById(toMongoID(id));
  }

  async findByTokenAndTokenType(token: string, type: TokenType) {
    const authToken = await AuthToken.findOne({ token, type });
    if (!authToken) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Auth token with token ${token} and type ${type} not found`);
    }
    return authToken;
  }

  async findUserTokenByTokenAndType(payload: { userId: string; token: string; type: TokenType }) {
    const authToken = await AuthToken.findOne({
      'user._id': toMongoID(payload.userId),
      token: payload.token,
      type: payload.type,
    });
    if (!authToken) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Auth token with token ${payload.token}, userId: ${payload.userId} and type: ${payload.type} not found`,
      );
    }
    return authToken;
  }

  async deleteManyByUserId(userId: string) {
    return await AuthToken.deleteMany({
      'user._id': toMongoID(userId),
    });
  }

  async deleteManyByUserIdAndToken(payload: { userId: string; token: string }) {
    return await AuthToken.deleteMany({
      'user._id': toMongoID(payload.userId),
      token: payload.token,
    });
  }

  async updateOneById(id: string, payload: UpdateAuthTokenPayload) {
    return await AuthToken.updateOne(
      {
        _id: toMongoID(id),
      },
      payload,
    );
  }
}

export const AuthRepository = new AuthRepositoryImpl();
