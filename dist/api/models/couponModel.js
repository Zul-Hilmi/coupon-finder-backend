"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    //coupon can have the same discount title
    discount: {
        type: String,
        trim: true,
        minLength: [3, "Discount cant be less than 3 character"],
        required: [true, "Discount is required"],
    },
    offer: {
        type: String,
        trim: true,
        minlength: [3, "Offer cant be less than 3 character"],
        required: [true, "Offer is required"]
    },
    expiry: {
        type: String,
        trim: true,
        validate: {
            validator: function (date) {
                if (date)
                    return new RegExp(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/).test(date);
            },
            message: props => `${props.value} is not a valid Date`
        },
        default: "No expiry date",
    },
    code: {
        type: String,
        trim: true,
        default: "No code needed for this coupon"
    },
    link: {
        type: String,
        trim: true,
        required: false,
        validate: {
            validator: function (url) {
                if (url)
                    return new URL(url).toString();
            },
        },
        default: "No link for this coupon"
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Coupon have to be owned by an owner"],
        ref: 'User'
    },
    store_name: {
        type: String,
        allowNull: true,
        default: null
    }
}, {
    timestamps: true
});
couponSchema.pre('save', function (next) {
    var _a, _b, _c, _d;
    if (!((_a = this.code) === null || _a === void 0 ? void 0 : _a.trim()))
        this.code = "No code";
    if (!((_b = this.expiry) === null || _b === void 0 ? void 0 : _b.trim()))
        this.expiry = "No expiry";
    if (!((_c = this.link) === null || _c === void 0 ? void 0 : _c.trim()))
        this.link = "No link";
    if (!((_d = this.description) === null || _d === void 0 ? void 0 : _d.trim()))
        this.description = "No description";
    next();
});
const Coupon = (0, mongoose_1.model)('Coupon', couponSchema);
exports.Coupon = Coupon;
