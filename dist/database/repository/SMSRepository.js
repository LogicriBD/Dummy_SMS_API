"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSRepository = void 0;
const SMS_1 = require("../model/SMS");
class SMSRepositoryImpl {
    async saveSMS(sms) {
        return await SMS_1.SMS.create(sms);
    }
    async findSMSByPhone(payload) {
        const findParams = {};
        if (payload.receiver) {
            findParams.receiver = {
                receiver: { $regex: new RegExp(payload.receiver, 'i') },
            };
        }
        if (payload.page && payload.limit) {
            return await SMS_1.SMS.find(findParams)
                .skip((payload.page - 1) * payload.limit)
                .limit(payload.limit);
        }
        return await SMS_1.SMS.find(findParams);
    }
    async countSMSByPhone(payload) {
        const findParams = {};
        if (payload.receiver) {
            findParams.receiver = {
                receiver: { $regex: new RegExp(payload.receiver, 'i') },
            };
        }
        if (payload.read !== undefined) {
            findParams.read = payload.read;
        }
        return await SMS_1.SMS.countDocuments(findParams);
    }
}
exports.SMSRepository = new SMSRepositoryImpl();
//# sourceMappingURL=SMSRepository.js.map