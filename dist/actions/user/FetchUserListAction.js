"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserListAction = void 0;
const UserRepository_1 = require("../../database/repository/UserRepository");
class FetchUserListAction {
    constructor(payload) {
        this.payload = payload;
    }
    async execute() {
        const users = await UserRepository_1.UserRepository.find(this.payload);
        const total = await UserRepository_1.UserRepository.count(this.payload);
        return {
            items: users,
            total: total,
            page: this.payload.page,
            limit: this.payload.limit,
        };
    }
}
exports.FetchUserListAction = FetchUserListAction;
//# sourceMappingURL=FetchUserListAction.js.map