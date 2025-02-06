"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const http_status_codes_1 = require("http-status-codes");
const nodemailer_1 = __importDefault(require("nodemailer"));
const ApiError_1 = require("../utils/ApiError");
class EmailServiceImpl {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: +process.env.SMTP_PORT,
            secure: process.env.SMTP_TLS === "true",
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    static getInstance() {
        if (!EmailServiceImpl.instance) {
            EmailServiceImpl.instance = new EmailServiceImpl();
        }
        return EmailServiceImpl.instance;
    }
    async sendEmail(email) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email.getRecipients(),
                subject: email.getSubject(),
                html: email.getMessage(),
            };
            return await this.transporter.sendMail(mailOptions);
        }
        catch (err) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Unable to send email. Please try again later.");
        }
    }
}
exports.EmailService = EmailServiceImpl.getInstance();
//# sourceMappingURL=EmailService.js.map