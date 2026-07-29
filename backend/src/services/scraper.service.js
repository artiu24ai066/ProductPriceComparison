import { scrapeAllStores } from "../scrapers/scraperManager.js";

export const searchFromScrapers = async (query) => {
    const products = await scrapeAllStores(query);
    return products;
};
