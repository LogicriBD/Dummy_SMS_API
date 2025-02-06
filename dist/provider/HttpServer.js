"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const AuthenticateUser_1 = require("../middleware/AuthenticateUser");
const PreventLockedUserAccess_1 = require("../middleware/PreventLockedUserAccess");
const ProcessUncaughtException_1 = require("../middleware/ProcessUncaughtException");
const ResolveApplicationError_1 = require("../middleware/ResolveApplicationError");
const NotFoundRoute_1 = require("../middleware/NotFoundRoute");
const ExpressRouter_1 = require("../utils/misc/ExpressRouter");
const RequestLogger_1 = require("../middleware/RequestLogger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (_b = (_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json()); // to support JSON-encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: true })); // to support URL-encoded bodies
ExpressRouter_1.ExpressRouter.initializeRoutes();
app.use(RequestLogger_1.loggingMiddleware);
app.use(NotFoundRoute_1.notFoundRoute);
app.use(AuthenticateUser_1.authenticateUser);
app.use(PreventLockedUserAccess_1.preventLockedUserAccess);
app.use(ExpressRouter_1.ExpressRouter.getRouter());
app.use(ProcessUncaughtException_1.processUncaughtException);
app.use(ResolveApplicationError_1.resolveApplicationError);
exports.HttpServer = app;
//# sourceMappingURL=HttpServer.js.map