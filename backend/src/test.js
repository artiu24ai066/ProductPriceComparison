import { scrapeAllStores } from "./scrapers/scraperManager.js";

const data = await scrapeAllStores("tv");

console.log(data);