import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        productKey: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        brand: {
            type: String,
            default: "",
            trim: true,
        },

        image: {
            type: String,
            default: "",
            trim: true,
        },

        price: {
            type: Number,
            default: null,
        },

        priceText: {
            type: String,
            default: "",
            trim: true,
        },

        storeName: {
            type: String,
            default: "",
            trim: true,
        },

        sourceUrl: {
            type: String,
            default: "",
            trim: true,
        },

        productSnapshot: {
            type: Schema.Types.Mixed,
            required: true,
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

wishlistSchema.index({ user: 1, productKey: 1 }, { unique: true });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
