"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
exports.logger = new winston_1.Logger({
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.json(), winston_1.format.printf((info) => `${new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()} ${info.level}: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : ' '))),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ level: 'error', filename: path_1.default.resolve(__dirname, '../../report/log/error.log') }),
        new winston_1.transports.File({ level: 'info', filename: path_1.default.resolve(__dirname, '../../report/log/activity.log') }),
    ],
});
//# sourceMappingURL=LogDriver.js.map