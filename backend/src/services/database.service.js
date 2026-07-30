import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ProductPrice } from "../models/productPrice.model.js";
import { PriceHistory } from "../models/priceHistory.model.js";
import { Store } from "../models/store.model.js";
import { SearchCache } from "../models/searchCache.model.js";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

export const getStoreByName = async (name) => {
    return await Store.findOne({ name }).lean();
};

export const getOrCreateStore = async (storeData) => {
    return await Store.findOneAndUpdate(
        { name: storeData.name },
        { $set: storeData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

export const getProductByGroupId = async (groupId) => {
    return await Product.findOne({ groupId }).lean();
};

export const saveProduct = async (productData) => {
    return await Product.findOneAndUpdate(
        { groupId: productData.groupId },
        { $set: productData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

export const saveProductPrice = async (priceData) => {
    return await ProductPrice.findOneAndUpdate(
        {
            product: priceData.product,
            store: priceData.store,
            productUrl: priceData.productUrl,
        },
        { $set: priceData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

export const savePriceHistory = async (historyData) => {
    return await PriceHistory.create(historyData);
};

export const getCachedSearchByQuery = async (normalizedQuery) => {
    return await SearchCache.findOne({ normalizedQuery }).lean();
};

export const saveSearchCacheEntry = async (cacheData) => {
    return await SearchCache.findOneAndUpdate(
        { normalizedQuery: cacheData.normalizedQuery },
        cacheData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
};
