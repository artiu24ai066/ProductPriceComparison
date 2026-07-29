import mongoose, { Schema } from "mongoose";

const priceHistorySchema = new Schema(
    {
        productPrice: {
            type: Schema.Types.ObjectId,
            ref: "ProductPrice",
            required: true,
        },

        store: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        
        price: {
            type: Number,
            required: true,
        },

        recordedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const PriceHistory = mongoose.model(
    "PriceHistory",
    priceHistorySchema
);
