"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGlobalEventListeners = exports.EventBus = void 0;
const events_1 = __importDefault(require("events"));
exports.EventBus = new events_1.default();
const registerGlobalEventListeners = () => { };
exports.registerGlobalEventListeners = registerGlobalEventListeners;
//# sourceMappingURL=EventBus.js.map