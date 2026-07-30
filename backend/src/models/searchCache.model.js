import mongoose, { Schema } from "mongoose";

const searchCacheSchema = new Schema(
    {
        query: {
            type: String,
            required: true,
            trim: true,
        },
        normalizedQuery: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        result: {
            type: Schema.Types.Mixed,
            required: true,
        },
        totalProducts: {
            type: Number,
            default: 0,
        },
        totalGroups: {
            type: Number,
            default: 0,
        },
        totalStores: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        lastUpdated: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const SearchCache = mongoose.model("SearchCache", searchCacheSchema);
