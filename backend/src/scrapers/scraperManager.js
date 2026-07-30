import { createContext, closeBrowser } from "./config/browser.js";

import { scrapeAmazon } from "./amazon/amazon.scraper.js";
import { scrapeFlipkart } from "./flipkart/flipkart.scraper.js";
import { scrapeReliance } from "./reliance/reliance.scraper.js";

import { formatProduct } from "./helpers/formatProduct.js";
import { groupProducts } from "./helpers/groupProducts.js";

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

        let products = [];

        if (amazon.status === "fulfilled") products.push(...amazon.value);
        if (flipkart.status === "fulfilled") products.push(...flipkart.value);
        if (reliance.status === "fulfilled") products.push(...reliance.value);

        products = products.map(formatProduct);
        
        products = groupProducts(products);
        
        products.sort((a, b) => a.lowestPrice - b.lowestPrice);

        const searchWords = query.toLowerCase().split(" ");

        products = products.filter(product =>
            searchWords.every(word =>
                product.normalizedTitle.includes(word)
            )
        );

        return {
            query,
            totalProducts: products.length,
            totalStores: [ ...new Set(products.flatMap(product => product.stores.map(store => store.store))), ].length,
            lastUpdated: new Date().toISOString(),
            products,
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

