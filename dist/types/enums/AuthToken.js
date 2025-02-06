"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTokenTypes = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["ACCESS"] = "Access";
    TokenType["REFRESH"] = "Refresh";
    TokenType["RESET_PASSWORD"] = "Reset Password";
    TokenType["RESET_LINK"] = "Reset Link";
    TokenType["VERIFY_EMAIL"] = "Verify Email";
})(TokenType || (exports.TokenType = TokenType = {}));
exports.allTokenTypes = Object.values(TokenType);
//# sourceMappingURL=AuthToken.js.map