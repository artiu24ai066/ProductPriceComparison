import mongoose from "mongoose";
import { Wishlist } from "../models/wishlist.model.js";
import { RecentlyViewed } from "../models/recentlyViewed.model.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        await Wishlist.syncIndexes();
        await RecentlyViewed.syncIndexes();
        console.log(`MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
};

export default connectDB;