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
exports.UserController = void 0;
const Controller_1 = require("../types/Controller");
const CaptureUploadedFile_1 = require("../middleware/CaptureUploadedFile");
const FetchCurrentUserAction_1 = require("../actions/user/FetchCurrentUserAction");
const UpdateCurrentUserAction_1 = require("../actions/user/UpdateCurrentUserAction");
const UpdateProfileRequest_1 = require("../validation/user/UpdateProfileRequest");
let UserController = class UserController {
    async fetchCurrentUser(req, res, next) {
        try {
            const currentUser = new FetchCurrentUserAction_1.FetchCurrentUserAction(req.user);
            const response = await currentUser.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async updateCurrentUser(req, res, next) {
        try {
            const updateCurrentUserAction = new UpdateCurrentUserAction_1.UpdateCurrentUserAction(req.body, req.user, req.file);
            const response = await updateCurrentUserAction.execute();
            return res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, Controller_1.GET)('/fetch'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "fetchCurrentUser", null);
__decorate([
    (0, Controller_1.POST)('/update', [(0, CaptureUploadedFile_1.withSingleFile)('avatar'), UpdateProfileRequest_1.updateUserRequestValidator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateCurrentUser", null);
exports.UserController = UserController = __decorate([
    Controller_1.Controller
], UserController);
//# sourceMappingURL=UserController.js.map