import { scrapeAllStores } from "./scrapers/scraperManager.js";

const data = await scrapeAllStores("shoes");

console.log(data);
