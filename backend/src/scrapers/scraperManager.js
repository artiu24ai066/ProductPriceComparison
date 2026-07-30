import { createContext, closeBrowser } from "./config/browser.js";

import { scrapeAmazon } from "./amazon/amazon.scraper.js";
import { scrapeFlipkart } from "./flipkart/flipkart.scraper.js";
import { scrapeReliance } from "./reliance/reliance.scraper.js";
import { processProducts } from "./helpers/normalizer/index.js";

export const scrapeAllStores = async (query) => {
    const amazonContext = await createContext();
    const flipkartContext = await createContext();
    const relianceContext = await createContext();

    try {
        const amazonPage = await amazonContext.newPage();
        const flipkartPage = await flipkartContext.newPage();
        const reliancePage = await relianceContext.newPage();

        const [amazon, flipkart, reliance] = await Promise.allSettled([
            scrapeAmazon(amazonPage, query),
            scrapeFlipkart(flipkartPage, query),
            scrapeReliance(reliancePage, query),
        ]);

        const allResults = [amazon, flipkart, reliance];
        const products = [];

        if (amazon.status === "fulfilled") products.push(...amazon.value);
        if (flipkart.status === "fulfilled") products.push(...flipkart.value);
        if (reliance.status === "fulfilled") products.push(...reliance.value);

        const failedCount = allResults.filter((result) => result.status === "rejected").length;
        if (failedCount === allResults.length) {
            const error = new Error("All store scrapes failed");
            error.details = allResults.map((result) => result.reason?.message || result.reason?.toString() || "Unknown error");
            throw error;
        }

        const groupedProducts = processProducts(products, query);

        return {
            query,
            totalProducts: products.length,
            totalGroups: groupedProducts.length,
            totalStores: Array.from(new Set(groupedProducts.flatMap((product) => product.sellers.map((seller) => seller.website)))).length,
            lastUpdated: new Date().toISOString(),
            products: groupedProducts,
        };
    }
    finally {
        await Promise.allSettled([
            amazonContext.close(),
            flipkartContext.close(),
            relianceContext.close(),
        ]);
        await closeBrowser();
    }
};

