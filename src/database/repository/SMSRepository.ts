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
      findParams.receiver = { $regex: new RegExp(payload.receiver, 'i') };
    }

    let query = SMS.find(findParams).sort({ createdAt: -1 });

    if (payload.page && payload.limit) {
      query = query.skip((payload.page - 1) * payload.limit).limit(payload.limit);
    }

    return await query;
  }

  public async countSMSByPhone(payload: CountSMSPayload) {
    const findParams: FilterQuery<SMSProps> = {};
    if (payload.receiver) {
      findParams.receiver = { $regex: new RegExp(payload.receiver, 'i') };
    }
    if (payload.read !== undefined) {
      findParams.read = payload.read;
    }
    return await SMS.countDocuments(findParams);
  }
}

export const SMSRepository = new SMSRepositoryImpl();
