"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendVerificationEmail = (userId, email, host) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = host;
    const route = "/user/create";
    const params = new URLSearchParams(userId);
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
    return transporter.sendMail(options);
});
exports.default = sendVerificationEmail;
