"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventLockedUserAccess = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../utils/ApiError");
const ExpressRouter_1 = require("../utils/misc/ExpressRouter");
const preventLockedUserAccess = (req, res, next) => {
    var _a;
    if (ExpressRouter_1.ExpressRouter.isPublicRoute(req.path)) {
        next();
    }
    else {
        const user = req.user;
        if (!user) {
            next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.PRECONDITION_FAILED, 'Unauthenticated access.'));
        }
        else if ((_a = user.lock) === null || _a === void 0 ? void 0 : _a.isLocked) {
            const lockedMessage = user.lock.feedback || 'Your account is locked. Please contact support for assistance.';
            next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.PRECONDITION_FAILED, lockedMessage));
        }
        else {
            next();
        }
    }
};
exports.preventLockedUserAccess = preventLockedUserAccess;
//# sourceMappingURL=PreventLockedUserAccess.js.map