import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        store: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },

        reviewer: {
            type: String,
            required: true,
        },

        reviewUrl: {
            type: String,
        },

        rating: {
            type: Number,
            required: true,
        },

        comment: {
            type: String,
            required: true,
        },

        sentiment: {
            type: String,
            enum: ["positive", "neutral", "negative"],
            default: "neutral",
        },

        source: {
            type: String,
            required: true,
        },

        reviewDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const Review = mongoose.model("Review", reviewSchema);
