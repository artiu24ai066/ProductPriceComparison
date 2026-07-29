import mongoose, { Schema } from "mongoose";

const productPriceSchema = new Schema(
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

        price: {
            type: Number,
            required: true,
        },

        originalPrice: {
            type: Number,
            default: 0,
        },

        discountPercentage: {
            type: Number,
            default: 0,
        },

        productUrl: {
            type: String,
            required: true,
        },

        inStock: {
            type: Boolean,
            default: true,
        },

        lastScrapedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const ProductPrice = mongoose.model("ProductPrice", productPriceSchema);

