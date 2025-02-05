import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UserRepository } from '../database/repository/UserRepository';
import { ApiError } from '../utils/ApiError';
import { ExpressRouter } from '../utils/misc/ExpressRouter';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
  algorithms: ['HS256'],
};

passport.use(
  new Strategy(options, async function (token, done) {
    const user = await UserRepository.findById(token.userId);
    if (!user) {
      return done(null, false);
    }
    done(null, user.getAuthInfo());
  }),
);

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  if (ExpressRouter.isPublicRoute(req.path)) {
    next();
  } else {
    passport.authenticate(
      'jwt',
      { session: false },
      function (error: any, user?: Express.User, info?: any, status?: number) {
        if (error) {
          next(error);
        }
        if (!user) {
          next(new ApiError(StatusCodes.UNAUTHORIZED, 'User is not authorized'));
        }
        req.user = user;
        next();
      },
    )(req, res, next);
  }
};
