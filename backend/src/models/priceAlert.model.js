import mongoose, { Schema } from "mongoose";

const priceAlertSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        targetPrice: {
            type: Number,
            required: true,
        },

        currentPrice: {
            type: Number,
            default: 0,
        },

        emailNotification: {
            type: Boolean,
            default: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PriceAlert = mongoose.model(
    "PriceAlert",
    priceAlertSchema
);
