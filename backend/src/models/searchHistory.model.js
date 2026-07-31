import mongoose, { Schema } from "mongoose";

const searchHistorySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        query: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        normalizedQuery: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        searchedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

