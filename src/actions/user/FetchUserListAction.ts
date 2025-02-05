import { UserProps } from '../../database/model/User';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { PaginatedList } from '../../types/Misc';
import { FetchUsersParams } from '../../validation/user/FetchUsersRequest';

export class FetchUserListAction implements Action {
  constructor(private payload: FetchUsersParams) {}

  public async execute(): Promise<PaginatedList<Partial<UserProps>>> {
    const users = await UserRepository.find(this.payload);
    const total = await UserRepository.count(this.payload);

    return {
      items: users,
      total: total,
      page: this.payload.page,
      limit: this.payload.limit,
    };
  }
}
