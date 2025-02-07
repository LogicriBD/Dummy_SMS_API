import { UserRepository } from '../../database/repository/UserRepository';
import { Action } from '../../types/Action';
import { UpdateUserRequestBody } from '../../validation/user/UpdateProfileRequest';
import { filterUser } from '../../utils/Helper';

export class UpdateCurrentUserAction implements Action {
  constructor(
    private payload: UpdateUserRequestBody,
    private currentUser: Express.User,
  ) {}

  public async execute() {
    const user = await UserRepository.updateById(this.currentUser.id, this.payload);
    return {
      user: filterUser(user),
    };
  }
}
