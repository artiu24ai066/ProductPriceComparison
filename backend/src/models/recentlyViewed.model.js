import mongoose, { Schema } from "mongoose";

const recentlyViewedSchema = new Schema(
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

        viewedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

recentlyViewedSchema.index(
    { user: 1, product: 1 },
    { unique: true }
);

export const RecentlyViewed = mongoose.model(
    "RecentlyViewed",
    recentlyViewedSchema
);
