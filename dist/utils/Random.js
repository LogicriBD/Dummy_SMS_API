"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUsername = void 0;
const crypto_1 = require("crypto");
const randomUsername = () => (0, crypto_1.randomUUID)().split('-').pop();
exports.randomUsername = randomUsername;
//# sourceMappingURL=Random.js.map