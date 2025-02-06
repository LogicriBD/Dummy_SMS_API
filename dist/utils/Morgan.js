"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morgan = exports.errorResponseFormat = exports.successResponseFormat = void 0;
const morgan_1 = __importDefault(require("morgan"));
const Helper_1 = require("./Helper");
morgan_1.default.token('message', (req, res) => {
    const response = res;
    const errorMessage = response.locals.errorMessage || 'No error message';
    return `${res.statusMessage} - ${errorMessage}`;
});
morgan_1.default.token('date-time', () => {
    const dateLocalString = new Date().toLocaleDateString();
    const timeLocalString = new Date().toLocaleTimeString();
    return `${dateLocalString}-${timeLocalString}`;
});
const getIpFormat = () => (!(0, Helper_1.isDevelopmentEnvironment)() ? ':remote-addr - ' : '');
exports.successResponseFormat = `${getIpFormat()}:method :date-time :url :status - :response-time ms`;
exports.errorResponseFormat = `${getIpFormat()}:method :date-time :url :status - :response-time ms - message: :message`;
exports.Morgan = morgan_1.default;
//# sourceMappingURL=Morgan.js.map