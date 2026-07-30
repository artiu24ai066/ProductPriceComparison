import { SearchCache } from "../models/searchCache.model.js";
import { normalizeQuery } from "../utils/searchUtils.js";
import { searchFromScrapers } from "./scraper.service.js";

const CACHE_TTL_MINUTES = 20;

export const getSearchCache = async (query) => {
    const normalizedQuery = normalizeQuery(query);
    return await SearchCache.findOne({ normalizedQuery }).lean();
};

export const getCachedSearch = async (query) => {
    const cache = await getSearchCache(query);
    if (!cache) return null;
    if (cache.expiresAt < new Date()) return null;
    return cache;
};

export const saveSearchCache = async (query, result) => {
    const normalizedQuery = normalizeQuery(query);
    const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);
    const cachePayload = {
        query,
        normalizedQuery,
        result,
        totalProducts: result.totalProducts,
        totalGroups: result.totalGroups,
        totalStores: result.totalStores,
        expiresAt,
        lastUpdated: new Date(),
    };

    return await SearchCache.findOneAndUpdate(
        { normalizedQuery },
        cachePayload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
};

export const fetchSearchResults = async (query) => {
    return await searchFromScrapers(query);
};
