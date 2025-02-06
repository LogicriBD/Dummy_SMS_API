"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyAccountSeeder = void 0;
const Helper_1 = require("../../utils/Helper");
const UserRepository_1 = require("../repository/UserRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class DummyAccountSeeder {
    async seed() {
        const user = await UserRepository_1.UserRepository.findOneByEmail(process.env.SUDO_EMAIL);
        if (user) {
            (0, Helper_1.log)('warn', '🟠 System admin account already exists');
            return;
        }
        const salt = await bcrypt_1.default.genSalt(Number(process.env.SALT_SIZE));
        const password = await bcrypt_1.default.hash(process.env.SUDO_PASSWORD, salt);
        await UserRepository_1.UserRepository.create({
            email: process.env.SUDO_EMAIL,
            password,
            username: 'SUDO',
            verified: true,
        });
        (0, Helper_1.log)('info', '✅ System admin account seeded');
    }
    async undo() {
        //Cannot Undo System Admin Account Seeder
    }
}
exports.DummyAccountSeeder = DummyAccountSeeder;
//# sourceMappingURL=DummyAccountSeeder.js.map