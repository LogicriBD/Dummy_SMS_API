"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordEmail = void 0;
const PrettifyEmail_1 = require("../PrettifyEmail");
class ForgotPasswordEmail {
    constructor(payload) {
        this.payload = payload;
        this.getMessage = () => {
            const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${this.payload.token}`;
            const message = `Your password reset link is: ${PrettifyEmail_1.PrettifyEmail.insertLink(resetPasswordUrl)}${PrettifyEmail_1.PrettifyEmail.tabSpace}This link will expire in ${this.payload.expiresIn.getHours()} hours. If you did not request this, please ignore this email and your password will remain unchanged.`;
            return PrettifyEmail_1.PrettifyEmail.template(this.getSubject(), message);
        };
        this.getRecipients = () => this.payload.email;
        this.getSubject = () => {
            return 'Instructions to reset your password';
        };
    }
}
exports.ForgotPasswordEmail = ForgotPasswordEmail;
//# sourceMappingURL=ForgotPasswordEmail.js.map