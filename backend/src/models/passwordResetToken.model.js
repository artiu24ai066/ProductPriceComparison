import mongoose, { Schema } from "mongoose";

/**
 * Stores a hashed password-reset token for a user.
 *
 * Security notes:
 *  - The plain token is NEVER stored — only a SHA-256 hash of it.
 *  - expiresAt is indexed with TTL so MongoDB auto-deletes expired documents.
 *  - used flag ensures a token cannot be replayed even within its expiry window.
 */
const passwordResetTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // SHA-256 hash of the random token sent to the user's email
        tokenHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        used: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// TTL index — MongoDB automatically removes expired documents
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast lookup by tokenHash
passwordResetTokenSchema.index({ tokenHash: 1 });

export const PasswordResetToken = mongoose.model(
    "PasswordResetToken",
    passwordResetTokenSchema
);
