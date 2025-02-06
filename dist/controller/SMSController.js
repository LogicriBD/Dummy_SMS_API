"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSController = void 0;
const Controller_1 = require("../types/Controller");
const SMSCreateAction_1 = require("../actions/samples/SMSCreateAction");
const SMSRequest_1 = require("../validation/sms/SMSRequest");
const CaptureUploadedFile_1 = require("../middleware/CaptureUploadedFile");
const SMSFetchAction_1 = require("../actions/samples/SMSFetchAction");
const FetchSMSRequest_1 = require("../validation/sms/FetchSMSRequest");
let SMSController = class SMSController {
    async sendSMS(req, res, next) {
        try {
            const smsAction = new SMSCreateAction_1.SMSCreateAction(req.params);
            const response = await smsAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async sendMultimediaSMS(req, res, next) {
        try {
            const smsAction = new SMSCreateAction_1.SMSCreateAction(req.body, req.files);
            const response = await smsAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async fetchSMS(req, res, next) {
        try {
            const smsAction = new SMSFetchAction_1.SMSFetchAction(req.query);
            const response = await smsAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.SMSController = SMSController;
__decorate([
    (0, Controller_1.GET)('/send-text/:userName/:password/:MsgType/:masking/:receiver/:message', [SMSRequest_1.textSMSRequestValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], SMSController.prototype, "sendSMS", null);
__decorate([
    (0, Controller_1.POST)('/send-multimedia', [(0, CaptureUploadedFile_1.withMultipleFiles)('media'), SMSRequest_1.multimediaSMSRequestValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], SMSController.prototype, "sendMultimediaSMS", null);
__decorate([
    (0, Controller_1.GET)('/fetch', [FetchSMSRequest_1.fetchSMSValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], SMSController.prototype, "fetchSMS", null);
exports.SMSController = SMSController = __decorate([
    Controller_1.Controller
], SMSController);
//# sourceMappingURL=SMSController.js.map