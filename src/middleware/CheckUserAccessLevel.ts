import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserProps } from '../database/model/User';
import { ApiError } from '../utils/ApiError';
import { UserType } from '../types/enums/User';

export type AccessDefinition = Partial<
  Pick<UserProps, 'active' | 'verified'> & {
    types: UserType[];
  }
>;
const defaultStatus: Required<AccessDefinition> = {
  active: true,
  verified: true,
  types: [],
};

export const checkUserAccessLevel = (accountStatus: AccessDefinition = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const expectedActiveStatus = accountStatus.active ?? defaultStatus.active;
    const expectedVerifiedStatus = accountStatus.verified ?? defaultStatus.verified;
    const allowedAccountTypes = accountStatus.types ?? defaultStatus.types;
    const isAllTypesOfUserAllowed = allowedAccountTypes.length === 0;

    const user = req.user;
    if (!user) {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Unauthorized ! access level not found'));
    } else {
      const isUserASuperAdmin = user.type === UserType.SYSTEM_ADMIN;
      const doesUserHaveAuthorization =
        isUserASuperAdmin || isAllTypesOfUserAllowed || allowedAccountTypes.includes(user.type);

      const generalMessage = 'Unauthorized Access. Request denied.';
      if (expectedActiveStatus !== user.active) {
        next(new ApiError(StatusCodes.FORBIDDEN, generalMessage));
      } else if (expectedVerifiedStatus !== user.verified) {
        next(new ApiError(StatusCodes.FORBIDDEN, generalMessage));
      } else if (!doesUserHaveAuthorization) {
        next(new ApiError(StatusCodes.FORBIDDEN, generalMessage));
      } else {
        next();
      }
    }
  };
};

export const allowAnyTypeOfUser = checkUserAccessLevel();
export const allowOnlyCustomers = checkUserAccessLevel({ types: [UserType.CUSTOMER] });
export const allowOnlyEmployees = checkUserAccessLevel({ types: [UserType.EMPLOYEE] });
export const allowOnlyAdmins = checkUserAccessLevel({ types: [UserType.ADMIN] });
