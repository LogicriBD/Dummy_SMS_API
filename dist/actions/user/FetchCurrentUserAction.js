"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCurrentUserAction = void 0;
const UserRepository_1 = require("../../database/repository/UserRepository");
const Helper_1 = require("../../utils/Helper");
class FetchCurrentUserAction {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }
    async execute() {
        const user = await UserRepository_1.UserRepository.findById(this.currentUser.id);
        return (0, Helper_1.filterUser)(user);
    }
}
exports.FetchCurrentUserAction = FetchCurrentUserAction;
//# sourceMappingURL=FetchCurrentUserAction.js.map