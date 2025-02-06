"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalFileSizeInBytes = exports.getLocalUploadDirPathFor = exports.toFlattenedString = exports.toResizedPhoneNumber = exports.filterUser = exports.log = exports.toMongoID = exports.makeOTPCode = void 0;
exports.isDevelopmentEnvironment = isDevelopmentEnvironment;
const lodash_1 = require("lodash");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const LogDriver_1 = require("../provider/LogDriver");
const mongoose_1 = require("mongoose");
const makeOTPCode = () => `${(0, lodash_1.random)(100000, 999999)}`;
exports.makeOTPCode = makeOTPCode;
const toMongoID = (id) => new mongoose_1.Types.ObjectId(id);
exports.toMongoID = toMongoID;
const log = (level, message, meta = undefined) => {
    LogDriver_1.logger.log(level, message, meta);
};
exports.log = log;
function isDevelopmentEnvironment() {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'uat') {
        return true;
    }
    else {
        return false;
    }
}
const filterUser = (user) => {
    var _a;
    const filteredUser = {
        _id: user._id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    if ((_a = user.lock) === null || _a === void 0 ? void 0 : _a.isLocked) {
        filteredUser.status = 'locked';
    }
    if (!user.active) {
        filteredUser.status = 'deactivated';
    }
    if (!user.verified) {
        filteredUser.status = 'unverified';
    }
    else {
        filteredUser.status = 'active';
    }
    return filteredUser;
};
exports.filterUser = filterUser;
const toResizedPhoneNumber = (phone, targetLength = 11) => {
    try {
        const meaningfulPart = `${phone}`.slice(-10);
        const fullForm = '+880' + meaningfulPart;
        return fullForm.slice(-targetLength);
    }
    catch (err) {
        console.log(`error in phone number resize: ${phone}`);
        return '';
    }
};
exports.toResizedPhoneNumber = toResizedPhoneNumber;
const toFlattenedString = (payload) => {
    if (!(typeof payload === 'object')) {
        throw Error(`Cannot render as error message for ${payload}`);
    }
    let errorMessage = '';
    for (const [key, value] of Object.entries(payload)) {
        errorMessage += `${key}: ${value}`;
    }
    return errorMessage;
};
exports.toFlattenedString = toFlattenedString;
const getLocalUploadDirPathFor = (fileName) => path_1.default.resolve(__dirname, '../../upload/', fileName);
exports.getLocalUploadDirPathFor = getLocalUploadDirPathFor;
const getLocalFileSizeInBytes = async (filePath) => (await fs.promises.stat(filePath)).size;
exports.getLocalFileSizeInBytes = getLocalFileSizeInBytes;
//# sourceMappingURL=Helper.js.map