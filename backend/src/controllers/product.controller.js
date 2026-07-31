import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";
import { SearchHistory } from "../models/searchHistory.model.js";
import { SearchEvent } from "../models/searchEvent.model.js";
import { normalizeQuery } from "../utils/searchUtils.js";

import {
    getCachedSearch,
    getSearchCache,
    saveSearchCache,
    fetchSearchResults,
} from "../services/search.service.js";

const recordSearchHistory = async (userId, query, normalizedQuery) => {
    if (!userId) return;

    const duplicateWindowStart = new Date(Date.now() - 60 * 1000);
    const recentDuplicate = await SearchHistory.findOne({
        user: userId,
        normalizedQuery,
        createdAt: { $gte: duplicateWindowStart },
    }).sort({ createdAt: -1 });

    if (recentDuplicate) return;

    await SearchHistory.create({
        user: userId,
        query,
        normalizedQuery,
        searchedAt: new Date(),
    });
};

const searchProducts = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q?.trim()) {
        throw new APIerror(400, "Search query is required");
    }

    const normalizedQuery = normalizeQuery(q);
    const trimmedQuery = q.trim();
    const isRegisteredUser = !!req.user;

    const cachedSearch = await getCachedSearch(q);
    if (cachedSearch) {
        if (isRegisteredUser) {
            await recordSearchHistory(req.user._id, trimmedQuery, normalizedQuery);
        }

        await SearchEvent.create({
            user: isRegisteredUser ? req.user._id : null,
            query: trimmedQuery,
            normalizedQuery,
            searchedAt: new Date(),
            source: isRegisteredUser ? "registered" : "guest",
        });

        return res.status(200).json(
            new APIresponse(
                200,
                cachedSearch.result,
                "Products fetched successfully (cached)"
            )
        );
    }

    const existingCache = await getSearchCache(q);

    try {
        const result = await fetchSearchResults(q);
        await saveSearchCache(q, result);

        if (isRegisteredUser) {
            await recordSearchHistory(req.user._id, trimmedQuery, normalizedQuery);
        }

        await SearchEvent.create({
            user: isRegisteredUser ? req.user._id : null,
            query: trimmedQuery,
            normalizedQuery,
            searchedAt: new Date(),
            source: isRegisteredUser ? "registered" : "guest",
        });

        return res.status(200).json(
            new APIresponse(
                200,
                result,
                "Products fetched successfully"
            )
        );
    } catch (error) {
        if (existingCache) {
            await SearchEvent.create({
                user: isRegisteredUser ? req.user._id : null,
                query: trimmedQuery,
                normalizedQuery,
                searchedAt: new Date(),
                source: isRegisteredUser ? "registered" : "guest",
            });

            return res.status(200).json(
                new APIresponse(
                    200,
                    existingCache.result,
                    "Products returned from cached results after scraping failure"
                )
            );
        }

        throw new APIerror(502, "Unable to fetch product results at this time. Please try again later.");
    }
});

export {
    searchProducts,
};
