import { StatusCodes } from 'http-status-codes';
import { CountUserParams, CreateUserPayload, FindUserParams, UpdateUserPayload } from '../../types/dto/User';
import { ApiError } from '../../utils/ApiError';
import { toMongoID } from '../../utils/Helper';
import { User, UserProps } from '../model/User';
import { FilterQuery } from 'mongoose';

class UserRepositoyImpl {
  async findById(id: string) {
    const user = await User.findById(toMongoID(id));
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with email ${email} not found`);
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with username ${username} not found`);
    }
    return user;
  }

  async findByPhone(phone: string) {
    const user = await User.findOne({
      phone,
    });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with phone ${phone} not found`);
    }
    return user;
  }

  async find(params: FindUserParams) {
    const findParams: FilterQuery<UserProps> = {};
    if (params.search) {
      findParams.username = { $regex: new RegExp(params.search, 'i') };
    }
    if (params.userType) {
      findParams.type = params.userType;
    }

    if (params.page && params.limit) {
      return await User.find(findParams)
        .select('-password')
        .skip((params.page - 1) * params.limit)
        .limit(params.limit);
    }
    return await User.find(params);
  }

  async count(params: CountUserParams) {
    const findParams: FilterQuery<UserProps> = {};
    if (params.search) {
      findParams.username = { $regex: new RegExp(params.search, 'i') };
    }
    if (params.userType) {
      findParams.type = params.userType;
    }

    return await User.countDocuments(findParams);
  }

  async create(payload: CreateUserPayload) {
    return await User.create({
      ...payload,
      mode: process.env.NODE_ENV,
    });
  }

  async updateById(id: string, payload: UpdateUserPayload) {
    const updateResult = await User.updateOne({ _id: toMongoID(id) }, payload);
    if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
      throw new Error(`User with id ${id} not found or not updated`);
    }
    return await this.findById(id);
  }
}

export const UserRepository = new UserRepositoyImpl();
