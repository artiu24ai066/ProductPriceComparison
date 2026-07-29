import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse }  from "../utils/APIresponse.js";
import { APIerror }     from "../utils/APIerror.js";

import { searchFromScrapers } from "../services/scraper.service.js";

const searchProducts = asyncHandler(async (req, res) => {

    const { q } = req.query;

    if (!q?.trim()) {
        throw new APIerror(400, "Search query is required");
    }

    const result = await searchFromScrapers(q);

    // result = { query, totalGroups, totalStores, lastUpdated, products: [...] }
    //
    // Frontend does:  setProducts(response.data.data)
    // APIresponse wraps: { statusCode, data: <what we pass here>, message, success }
    //
    // So we pass result.products directly as `data` so the frontend receives
    // the grouped-products array straight from response.data.data.
    return res.status(200).json(
        new APIresponse(
            200,
            result.products,
            `Found ${result.totalGroups} products from ${result.totalStores} store(s)`
        )
    );

});

export { searchProducts };
