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
                if (!date)
                    return "No expiry date";
                const isValidFormat = new RegExp(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/).test(date);
                if (isValidFormat == false)
                    return "No expiry date";
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
        validate: {
            validator: function (url) {
                if (!url)
                    return "No link for this coupon";
                try {
                    return new URL(url);
                }
                catch (err) {
                    return "No link for this coupon";
                }
            }
        },
        default: "No link for this coupon"
    },
    description: {
        type: String,
        minlength: [6, "Description can't be less than 6 characters "]
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
const Coupon = (0, mongoose_1.model)('Coupon', couponSchema);
exports.Coupon = Coupon;
