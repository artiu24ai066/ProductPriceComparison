import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
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

        store: {
            type: Schema.Types.ObjectId,
            ref: "Store",
        },
    },
    {
        timestamps: true,
    }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
