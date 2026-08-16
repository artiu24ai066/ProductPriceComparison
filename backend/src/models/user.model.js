import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            trim: true,
            default: "",
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        avatar: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        refreshToken: {
            type: String,
        },

        address: {
            country: { type: String, default: "", trim: true },
            state:   { type: String, default: "", trim: true },
            city:    { type: String, default: "", trim: true },
            pincode: { type: String, default: "", trim: true },
        },
    },
    {
        timestamps: true,
    }
);

// Sparse unique index — only enforces uniqueness when phone has a value,
// so existing users with no phone (empty string) are not affected.
userSchema.index(
    { phone: 1 },
    { unique: true, sparse: true, partialFilterExpression: { phone: { $gt: "" } } }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
