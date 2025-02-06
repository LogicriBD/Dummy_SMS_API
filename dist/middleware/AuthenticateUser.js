"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const UserRepository_1 = require("../database/repository/UserRepository");
const ApiError_1 = require("../utils/ApiError");
const ExpressRouter_1 = require("../utils/misc/ExpressRouter");
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256'],
};
passport_1.default.use(new passport_jwt_1.Strategy(options, async function (token, done) {
    const user = await UserRepository_1.UserRepository.findById(token.userId);
    if (!user) {
        return done(null, false);
    }
    done(null, user.getAuthInfo());
}));
const authenticateUser = (req, res, next) => {
    if (ExpressRouter_1.ExpressRouter.isPublicRoute(req.path)) {
        next();
    }
    else {
        passport_1.default.authenticate('jwt', { session: false }, function (error, user, info, status) {
            if (error) {
                next(error);
            }
            if (!user) {
                next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User is not authorized'));
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=AuthenticateUser.js.map