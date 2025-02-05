import { NextFunction, Request, Response } from 'express';
import { Controller, GET, POST } from '../types/Controller';
import { allowOnlyAdmins } from '../middleware/CheckUserAccessLevel';
import { withSingleFile } from '../middleware/CaptureUploadedFile';
import { FetchCurrentUserAction } from '../actions/user/FetchCurrentUserAction';
import { FetchUserListAction } from '../actions/user/FetchUserListAction';
import { UpdateCurrentUserAction } from '../actions/user/UpdateCurrentUserAction';
import { FetchUsersParams, fetchUsersValidator } from '../validation/rest-api/user/FetchUsersRequest';
import { UpdateUserRequestBody, updateUserRequestValidator } from '../validation/rest-api/user/UpdateProfileRequest';

@Controller
export class UserController {
  @GET('/fetch')
  public async fetchCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = new FetchCurrentUserAction(req.user!);
      const response = await currentUser.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @GET('/', [allowOnlyAdmins, fetchUsersValidator])
  public async fetchUserList(req: Request<unknown, unknown, unknown, FetchUsersParams>, res: Response, next: NextFunction) {
    try {
      const userList = new FetchUserListAction(req.query);
      const response = await userList.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  @POST('/update', [withSingleFile('avatar'), updateUserRequestValidator])
  public async updateCurrentUser(req: Request<unknown, unknown, UpdateUserRequestBody>, res: Response, next: NextFunction) {
    try {
      const updateCurrentUserAction = new UpdateCurrentUserAction(req.body, req.user!, req.file!);
      const response = await updateCurrentUserAction.execute();
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
