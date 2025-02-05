import { FilterQuery } from 'mongoose';
import { SMS, SMSProps } from '../model/SMS';
import { CountSMSPayload, CreateSMSPayload, FindSMSPayload } from '../../types/dto/SMS';

class SMSRepositoryImpl {
  public async saveSMS(sms: CreateSMSPayload) {
    return await SMS.create(sms);
  }

  public async findSMSByPhone(payload: FindSMSPayload) {
    const findParams: FilterQuery<SMSProps> = {};
    if (payload.receiver) {
      findParams.receiver = {
        receiver: { $regex: new RegExp(payload.receiver, 'i') },
      };
    }
    if (payload.page && payload.limit) {
      return await SMS.find(findParams)
        .skip((payload.page - 1) * payload.limit)
        .limit(payload.limit);
    }
    return await SMS.find(findParams);
  }

  public async countSMSByPhone(payload: CountSMSPayload) {
    const findParams: FilterQuery<SMSProps> = {};
    if (payload.receiver) {
      findParams.receiver = {
        receiver: { $regex: new RegExp(payload.receiver, 'i') },
      };
    }
    if (payload.read !== undefined) {
      findParams.read = payload.read;
    }
    return await SMS.countDocuments(findParams);
  }
}

export const SMSRepository = new SMSRepositoryImpl();
