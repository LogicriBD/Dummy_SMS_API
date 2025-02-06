"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundRoute = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../utils/ApiError");
const ExpressRouter_1 = require("../utils/misc/ExpressRouter");
const notFoundRoute = async (req, res, next) => {
    const currentPath = req.path;
    if (ExpressRouter_1.ExpressRouter.getRoutes().includes(currentPath) || ExpressRouter_1.ExpressRouter.isPublicRoute(currentPath)) {
        return next();
    }
    next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `The requested API ${req.path} was not found for method ${req.method}`));
};
exports.notFoundRoute = notFoundRoute;
//# sourceMappingURL=NotFoundRoute.js.map