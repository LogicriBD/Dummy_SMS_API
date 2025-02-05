import { NextFunction, Request, Response } from 'express';
import { Controller, GET, POST } from '../types/Controller';
import { withSingleFile } from '../middleware/CaptureUploadedFile';
import { FetchCurrentUserAction } from '../actions/user/FetchCurrentUserAction';
import { UpdateCurrentUserAction } from '../actions/user/UpdateCurrentUserAction';
import { UpdateUserRequestBody, updateUserRequestValidator } from '../validation/user/UpdateProfileRequest';

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
