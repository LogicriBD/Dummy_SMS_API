"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCurrentUserAction = void 0;
const UserRepository_1 = require("../../database/repository/UserRepository");
const Helper_1 = require("../../utils/Helper");
class UpdateCurrentUserAction {
    constructor(payload, currentUser, file) {
        this.payload = payload;
        this.currentUser = currentUser;
        this.file = file;
    }
    async execute() {
        const user = await UserRepository_1.UserRepository.updateById(this.currentUser.id, this.payload);
        return {
            user: (0, Helper_1.filterUser)(user),
        };
    }
}
exports.UpdateCurrentUserAction = UpdateCurrentUserAction;
//# sourceMappingURL=UpdateCurrentUserAction.js.map