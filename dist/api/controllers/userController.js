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
exports.logout = exports.login = exports.remove = exports.update = exports.detail = exports.create = exports.email = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../models/userModel");
const mail_1 = __importDefault(require("../../config/services/mail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const couponModel_1 = require("../models/couponModel");
const clientError_1 = __importDefault(require("../../config/clientError"));
const ratingModel_1 = require("../models/ratingModel");
const email = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.body;
    const existingUser = yield userModel_1.User.findOne({ email: user.email });
    let userId;
    if (existingUser) {
        if (existingUser.active === false)
            userId = existingUser._id;
        else
            throw new clientError_1.default(409, "Email already exist");
    }
    else {
        if (((_a = user.role) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "admin")
            throw new clientError_1.default(403, "Invalid Role");
        const { _id } = yield new userModel_1.User(user).save();
        userId = _id;
    }
    const emailToken = jsonwebtoken_1.default.sign({ userId }, process.env.EMAIL_SECRET, { expiresIn: "3d" });
    const sent = yield (0, mail_1.default)(emailToken, user.email, `${req.protocol}://${req.headers.host}`)
        .catch(err => { throw new clientError_1.default(502, "Something went wrong when sending email,please try again later"); });
    res.status(200).json({ message: "Check your email for verification link" });
}));
exports.email = email;
const create = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!req.query.confirm)
        throw new clientError_1.default(403);
    const token = (req.query.confirm);
    const validationToken = jsonwebtoken_1.default.verify(token.slice(0, -1), process.env.EMAIL_SECRET);
    const userId = validationToken.userId;
    if (!userId || !(0, mongoose_1.isValidObjectId)(userId))
        throw new clientError_1.default(401, "Token have been tampered with");
    const user = yield userModel_1.User.findById(userId).orFail(() => { throw new clientError_1.default(404, "User doesnt exist"); });
    if (user.active != false)
        throw new clientError_1.default(409, "User is already active");
    user.active = true;
    if (((_b = user.role) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "admin")
        throw new clientError_1.default(403, "Invalid Role");
    yield user.save();
    res.status(200).json({ message: "Successfully created user,you can now login" });
}));
exports.create = create;
const login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.User.login(email, password);
    if (!user)
        throw new clientError_1.default(401, "Invalid Credential");
    if (user.active === false)
        throw new clientError_1.default(401, "Please activate this account first");
    res.json({ message: "Logged in successfully", token: generateToken(user._id), id: user._id });
}));
exports.login = login;
const logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    res.json({ message: "Logged Out" });
}));
exports.logout = logout;
// the owner of the account have been confirmed before the detail,update and remove middlewares  
const detail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(req.params.id).select("-active")
        .orFail(() => { throw new clientError_1.default(404, "User does not exist"); });
    res.status(200).json({ message: user });
}));
exports.detail = detail;
const update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(req.params.id)
        .orFail(() => { throw new clientError_1.default(404, "User does not exist"); });
    const { name, password } = req.body;
    user.name = name !== null && name !== void 0 ? name : user.name;
    user.password = password !== null && password !== void 0 ? password : user.password;
    yield user.save();
    req.user = user; //change the session which is already authorized and authenticate first 
    res.status(200).json({ message: "Updated successfully" });
}));
exports.update = update;
const remove = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.User.deleteOne({ _id: req.params.id }).orFail(() => { throw new clientError_1.default(404, "User does not exist"); });
    yield couponModel_1.Coupon.deleteMany({ owner: req.params.id });
    yield ratingModel_1.Rating.deleteMany({ user: req.params.id });
    next();
}));
exports.remove = remove;
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
