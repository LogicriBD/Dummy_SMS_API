"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationEmail = void 0;
const PrettifyEmail_1 = require("../PrettifyEmail");
class RegistrationEmail {
    constructor(payload) {
        this.payload = payload;
        this.getMessage = () => {
            const resetPasswordUrl = `${process.env.FRONTEND_URL}/verify-email?token=${this.payload.token}`;
            const message = `Your email verification link is: ${PrettifyEmail_1.PrettifyEmail.insertLink(resetPasswordUrl)}${PrettifyEmail_1.PrettifyEmail.tabSpace}This link will expire in ${this.payload.expiresIn.getHours()} hours. If you did not request this, please ignore this email and your password will remain unchanged. ${PrettifyEmail_1.PrettifyEmail.linebreak}
      Enter the following otp in the link given above to verify your email:${PrettifyEmail_1.PrettifyEmail.linebreak} ${PrettifyEmail_1.PrettifyEmail.otp(this.payload.otp)}`;
            return PrettifyEmail_1.PrettifyEmail.template(this.getSubject(), message);
        };
        this.getRecipients = () => this.payload.email;
        this.getSubject = () => {
            return 'Please Verify Your Email';
        };
    }
}
exports.RegistrationEmail = RegistrationEmail;
//# sourceMappingURL=RegistrationEmail.js.map