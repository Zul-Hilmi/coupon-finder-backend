"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        maxlength: [500, "Comments can't be more than 500"],
    },
    like: Boolean,
    coupon: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Coupon'
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});
const Rating = (0, mongoose_1.model)('Rating', ratingSchema);
exports.Rating = Rating;
