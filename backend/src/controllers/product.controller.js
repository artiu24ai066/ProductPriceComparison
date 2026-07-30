import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";

import {
    getCachedSearch,
    getSearchCache,
    saveSearchCache,
    fetchSearchResults,
} from "../services/search.service.js";

const searchProducts = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q?.trim()) {
        throw new APIerror(400, "Search query is required");
    }

    const cachedSearch = await getCachedSearch(q);
    if (cachedSearch) {
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

        return res.status(200).json(
            new APIresponse(
                200,
                result,
                "Products fetched successfully"
            )
        );
    } catch (error) {
        if (existingCache) {
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
