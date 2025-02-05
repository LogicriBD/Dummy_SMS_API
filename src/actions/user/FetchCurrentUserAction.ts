import { omit } from 'lodash';
import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { filterUser } from '../../utils/Helper';

export class FetchCurrentUserAction implements Action {
  constructor(private currentUser: Express.User) {}

  public async execute() {
    const user = await UserRepository.findById(this.currentUser.id);
    return filterUser(user);
  }
}
