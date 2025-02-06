"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const Morgan_1 = require("../utils/Morgan");
const Helper_1 = require("../utils/Helper");
const successHandler = (0, Morgan_1.Morgan)(Morgan_1.successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: {
        write: (message) => {
            (0, Helper_1.log)('info', message.trim());
        },
    },
});
const errorHandler = (0, Morgan_1.Morgan)(Morgan_1.errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: {
        write: (message) => {
            (0, Helper_1.log)('error', message.trim());
        },
    },
});
const loggingMiddleware = (request, response, next) => {
    successHandler(request, response, () => {
        errorHandler(request, response, next);
    });
};
exports.loggingMiddleware = loggingMiddleware;
//# sourceMappingURL=RequestLogger.js.map