import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";
import { SearchHistory } from "../models/searchHistory.model.js";
import { SearchEvent } from "../models/searchEvent.model.js";
import { User } from "../models/user.model.js";
import { RecentlyViewed } from "../models/recentlyViewed.model.js";
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

const HOME_TRENDING_LOOKBACK_MONTHS = 6;

const getHomeTrendingCutoff = () => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - HOME_TRENDING_LOOKBACK_MONTHS);
    return cutoff;
};

const stableHash = (value = "") => {
    const input = value.toString();
    let hash = 0;

    for (let index = 0; index < input.length; index += 1) {
        hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
    }

    return Math.abs(hash).toString(16);
};

const formatPriceText = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
};

const buildRecentlyViewedSnapshot = (product = {}) => {
    const bestSeller = product.lowestPriceSeller || product.cheapestAvailableSeller || product.sellers?.[0] || {};
    const sourceUrl = bestSeller.url || bestSeller.affiliateUrl || product.url || "";
    const title = product.canonicalTitle || product.name || product.title || product.rawTitle || "Product";
    const productKeyBase = [product.groupId, product.canonicalTitle, sourceUrl]
        .filter(Boolean)
        .join("::");

    const productKey = `rv_${stableHash(productKeyBase || JSON.stringify(product || {}))}`;
    const price = product.priceStats?.lowest ?? bestSeller.price ?? product.price ?? null;

    return {
        productKey,
        title,
        brand: product.brand || "",
        image: product.images?.primary || product.images?.gallery?.[0] || product.image || "",
        price,
        priceText: formatPriceText(price),
        storeName: bestSeller.website || bestSeller.sellerName || "",
        sourceUrl,
        productSnapshot: product,
        metadata: {
            rating: product.overallRating ?? bestSeller.rating ?? null,
            reviewCount: bestSeller.reviewCount ?? null,
            availability: product.availability ?? bestSeller.availability ?? null,
        },
    };
};

const syncRecentlyViewedProducts = async (userId, products = []) => {
    if (!userId || !Array.isArray(products) || !products.length) return;

    const uniqueSnapshots = new Map();

    products.slice(0, 50).forEach((product) => {
        const snapshot = buildRecentlyViewedSnapshot(product);
        uniqueSnapshots.set(snapshot.productKey, snapshot);
    });

    const operations = Array.from(uniqueSnapshots.values()).map((snapshot) => ({
        updateOne: {
            filter: {
                user: userId,
                productKey: snapshot.productKey,
            },
            update: {
                $set: {
                    ...snapshot,
                    viewedAt: new Date(),
                    user: userId,
                },
            },
            upsert: true,
        },
    }));

    if (operations.length) {
        await RecentlyViewed.bulkWrite(operations, { ordered: false });
    }
};

const getHomeTrendingStats = asyncHandler(async (req, res) => {
    const lookbackCutoff = getHomeTrendingCutoff();

    const [trendingSearches, searchesCount, registeredUsersCount] = await Promise.all([
        SearchEvent.aggregate([
            {
                $match: {
                    searchedAt: { $gte: lookbackCutoff },
                },
            },
            {
                $group: {
                    _id: "$normalizedQuery",
                    query: { $first: "$query" },
                    count: { $sum: 1 },
                    latestSearchedAt: { $max: "$searchedAt" },
                },
            },
            {
                $sort: {
                    count: -1,
                    latestSearchedAt: -1,
                    _id: 1,
                },
            },
            {
                $limit: 30,
            },
        ]),
        SearchEvent.countDocuments(),
        User.countDocuments(),
    ]);

    return res.status(200).json(
        new APIresponse(
            200,
            {
                trendingSearches: trendingSearches.map((item) => ({
                    query: item.query || item._id,
                    normalizedQuery: item._id,
                    count: item.count,
                })),
                searchesCount,
                registeredUsersCount,
                lookbackMonths: HOME_TRENDING_LOOKBACK_MONTHS,
            },
            "Home trending stats fetched successfully"
        )
    );
});

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
            await syncRecentlyViewedProducts(req.user._id, cachedSearch.result?.products || []);
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
            await syncRecentlyViewedProducts(req.user._id, result?.products || []);
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

            if (isRegisteredUser) {
                await syncRecentlyViewedProducts(req.user._id, existingCache.result?.products || []);
            }

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
    getHomeTrendingStats,
    searchProducts,
};
