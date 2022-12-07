"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendVerificationEmail(userId, email, host) {
    const baseUrl = host; //process.env.HOSTNAME
    const route = "/user/create";
    const params = new URLSearchParams(userId);
    const sent = true;
    const transporter = nodemailer_1.default.createTransport({
        service: "hotmail",
        auth: {
            user: "CP_Finder@outlook.com",
            pass: "coupon_finder123"
        }
    });
    const options = {
        from: "CP_Finder@outlook.com",
        to: `${email}`,
        subjects: "Account registration confirmation",
        text: `Click to create account: ${baseUrl}${route}?confirm=${params}`
    };
    transporter.sendMail(options, (err, info) => {
        console.log("Info:", info);
        console.log("ERROR:", err);
        if (info != null) {
            return true;
        }
        else if (info != null) {
            return false;
        }
    });
    return false;
}
exports.default = sendVerificationEmail;
