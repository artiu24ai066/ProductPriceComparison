import mongoose, { Schema } from "mongoose";

const searchEventSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
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
            index: true,
        },
        searchedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        source: {
            type: String,
            enum: ["guest", "registered"],
            default: "guest",
        },
    },
    {
        timestamps: true,
    }
);

searchEventSchema.index({ user: 1, searchedAt: -1 });

export const SearchEvent = mongoose.model("SearchEvent", searchEventSchema);
