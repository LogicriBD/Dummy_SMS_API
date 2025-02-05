import fs from 'fs';
import { UserRepository } from '../../database/repository/UserRepository';
import { StorageFolder, StorageService } from '../../provider/StorageService';
import { Action } from '../../types/Action';
import { UpdateUserPayload } from '../../types/dto/User';
import { UpdateUserRequestBody } from '../../validation/rest-api/user/UpdateProfileRequest';
import { omit } from 'lodash';
import { filterUser } from '../../utils/Helper';

export class UpdateCurrentUserAction implements Action {
  constructor(
    private payload: UpdateUserRequestBody,
    private currentUser: Express.User,
    private file: Express.Multer.File,
  ) {}

  public async execute() {
    const fileUrl = await StorageService.uploadFileFromPath({
      keys: [StorageFolder.user, this.file.path],
    });

    const updatePayload: UpdateUserPayload = {
      ...this.payload,
      photo: fileUrl.downloadUrl,
    };
    const user = await UserRepository.updateById(this.currentUser.id, updatePayload);
    fs.unlinkSync(this.file.path);
    return {
      user: filterUser(user),
    };
  }
}
