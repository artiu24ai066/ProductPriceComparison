import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";

import { searchFromScrapers } from "../services/scraper.service.js";

const searchProducts = asyncHandler(async (req, res) => {

    const { q } = req.query;

    if (!q?.trim()) {
        throw new APIerror(400, "Search query is required");
    }

    const result = await searchFromScrapers(q);

    return res.status(200).json(
        new APIresponse(
            200,
            result,
            "Products fetched successfully"
        )
    );

});

export {
    searchProducts,
};
