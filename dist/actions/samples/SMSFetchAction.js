"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSFetchAction = void 0;
const SMSRepository_1 = require("../../database/repository/SMSRepository");
class SMSFetchAction {
    constructor(params) {
        this.params = params;
    }
    async execute() {
        const sms = await SMSRepository_1.SMSRepository.findSMSByPhone({
            receiver: this.params.search,
            page: this.params.page,
            limit: this.params.limit,
        });
        const count = await SMSRepository_1.SMSRepository.countSMSByPhone({
            receiver: this.params.search,
        });
        return {
            items: sms,
            total: count,
            page: this.params.page,
            limit: this.params.limit,
        };
    }
}
exports.SMSFetchAction = SMSFetchAction;
//# sourceMappingURL=SMSFetchAction.js.map