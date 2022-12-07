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
exports.scrape = exports.deleteRating = exports.listRating = exports.rate = exports.remove = exports.update = exports.detail = exports.list = exports.create = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const couponModel_1 = require("../models/couponModel");
const ratingModel_1 = require("../models/ratingModel");
const scrape_1 = require("../../config/services/scrape");
const puppeteer_1 = __importDefault(require("puppeteer"));
const request_1 = __importDefault(require("request"));
const clientError_1 = __importDefault(require("../../config/clientError"));
const create = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role == "shopper")
        throw new clientError_1.default(403);
    console.log("lepa");
    const coupon = req.body;
    coupon.owner = req.user._id;
    yield new couponModel_1.Coupon(coupon).save();
    res.status(200).json({ message: "Successfully created" });
}));
exports.create = create;
const list = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Filter search based on:
    //alphabet:owner
    //alphabet:discount(name)
    //before,after,range:expiry date
    //likes and dislikes:ratings
    //number:comments
    //Owner could only see their coupon
    //-owner have FIXED filter where the coupon's onwner is owner's id
    //Shopper can see all coupon
    let coupons;
    if (req.user && req.user.role.toLowerCase() === "owner") {
        coupons = yield couponModel_1.Coupon.find({ owner: req.user._id });
    }
    else {
        coupons = yield couponModel_1.Coupon.find().populate('owner');
    }
    res.status(200).json({ messsage: coupons });
}));
exports.list = list;
const detail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const coupon = yield couponModel_1.Coupon.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)
        .orFail(() => { throw new clientError_1.default(404, "Coupon doesn't exist"); });
    const ratings = yield ratingModel_1.Rating.find({ coupon: coupon._id });
    res.status(200).json({ messsage: { coupon, ratings } });
}));
exports.detail = detail;
const update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield couponModel_1.Coupon.findOne({
        id: req.params.id,
        owner: req.user._id
    }).orFail(() => { throw new clientError_1.default(403); });
    const { discount, expiry, code, link, description } = req.body;
    coupon.discount = discount !== null && discount !== void 0 ? discount : coupon.discount;
    coupon.expiry = expiry;
    coupon.code = code;
    coupon.link = link;
    coupon.description = description;
    coupon.save();
    res.status(200).json({ message: "Updated succesfully" });
}));
exports.update = update;
const remove = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield couponModel_1.Coupon.deleteOne({
        id: req.params.id,
        owner: req.user._id
    }).orFail(() => { throw new clientError_1.default(404, "Coupon doesn't exist"); });
    const ratings = yield ratingModel_1.Rating.deleteMany({ coupon: req.params.id });
    res.status(200).json({ message: "Coupon deleted successfully" });
}));
exports.remove = remove;
//---------------------------------------------------------------------------------//
// rating
const rate = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role != "shopper")
        throw new clientError_1.default(403, "Only shopper can rate");
    const couponId = req.body.couponId;
    const { comment, like } = req.body;
    if (!comment || comment.trim().length < 1) {
        if (!like || like.toLowerCase() != "likes" || like.toLowerCase() != "dislike")
            throw new clientError_1.default(400, "Comment cannot be empty");
    }
    const coupon = yield couponModel_1.Coupon.findById(couponId).orFail(() => { throw new clientError_1.default(404, "Coupon doesn't exist"); });
    const rated = yield ratingModel_1.Rating.find({ user: req.user._id, coupon: couponId });
    if (rated)
        throw new clientError_1.default(403, "Already commented");
    const rating = { comment, like, user: req.user._id, coupon: couponId };
    yield (new ratingModel_1.Rating(rating)).save();
    res.status(200).json({ message: "Rating Submitted" });
}));
exports.rate = rate;
const listRating = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role != "shopper")
        throw new clientError_1.default(403, "Only shopper can access this page");
    const ratings = yield ratingModel_1.Rating.find({ user: req.user._id });
    res.json({ message: ratings });
}));
exports.listRating = listRating;
const deleteRating = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role != "shopper")
        throw new clientError_1.default(403, "Only shopper can access this page");
    yield ratingModel_1.Rating.deleteOne({ _id: req.body.ratingId, user: req.user._id }).orFail(() => { throw new clientError_1.default(404, "Rating doesn't exist"); });
    res.json({ message: "Rating Deleted successfully" });
}));
exports.deleteRating = deleteRating;
//---------------------------------------------------------------------------------//
//admin scrape
const scrape = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (req.user.role.toLowerCase() != "admin")
        throw new clientError_1.default(403);
    const adminId = req.user._id;
    const shopName = (_b = req.body.shopName) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    if (!shopName)
        throw new clientError_1.default(400, "Shop name is not given");
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.goto(`https://www.hargapedia.com.my/vouchers/store/${shopName}`, { timeout: 0 });
    //scrape the element use for sending request
    const discounts = yield page.$$eval(".styles_colMid__3FOth h4", (e) => { return e.map(x => x.textContent); });
    for (const discount of discounts) {
        (0, request_1.default)((0, scrape_1.getOption)(discount), (error, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (!error && response) {
                if (response.body) {
                    let result = JSON.parse(response.body);
                    let detail = result.data.getExternalVoucherBySlug;
                    let expiry = (0, scrape_1.formatDate)(detail.expiry);
                    let description = (0, scrape_1.formatDescription)(detail.description.en);
                    let code = detail.code;
                    let link = detail.outbound_url;
                    let coupon = new couponModel_1.Coupon({ discount, expiry, code, link, description, owner: adminId });
                    yield coupon.save();
                }
            }
        }));
    }
    yield browser.close();
    res.status(200).json({ message: "Done scraping" });
}));
exports.scrape = scrape;