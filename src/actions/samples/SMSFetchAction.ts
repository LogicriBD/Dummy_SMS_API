import { SMSProps } from '../../database/model/SMS';
import { SMSRepository } from '../../database/repository/SMSRepository';
import { Action } from '../../types/Action';
import { PaginatedList } from '../../types/Misc';
import { FetchSMSParams } from '../../validation/sms/FetchSMSRequest';

export class SMSFetchAction implements Action {
  constructor(private params: FetchSMSParams) {}

  public async execute(): Promise<PaginatedList<SMSProps>> {
    const sms = await SMSRepository.findSMSByPhone({
      receiver: this.params.search,
      page: this.params.page,
      limit: this.params.limit,
    });
    const count = await SMSRepository.countSMSByPhone({
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
