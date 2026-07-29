import { DEFAULT_HEADERS } from "../config/headers.js";
import { AMAZON_SELECTORS } from "./amazon.selectors.js";
import { cleanPrice } from "../helpers/cleanPrice.js";
import { cleanText } from "../helpers/cleanText.js";
import { getElement } from "../helpers/getElement.js";
import { getImage } from "../helpers/getImage.js";
import { getUrl } from "../helpers/getUrl.js";
import { SCRAPER_URLS, MAX_PRODUCTS } from "../constants.js";

export const scrapeAmazon = async (page, searchQuery) => {

    try {
        await page.setExtraHTTPHeaders(DEFAULT_HEADERS);

        await page.goto(
            `${SCRAPER_URLS.amazon}${encodeURIComponent(searchQuery)}`,
            {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            }
        );

        await page.waitForSelector(AMAZON_SELECTORS.product[0], { timeout: 30000 });
    
        const cards = page.locator(AMAZON_SELECTORS.product[0]);

        const count = Math.min(await cards.count(), MAX_PRODUCTS);

        const products = [];

        for (let i = 0; i < count; i++) {
            const card = cards.nth(i);

            const titleElement = await getElement(card, AMAZON_SELECTORS.title);
            const priceElement = await getElement(card, AMAZON_SELECTORS.price);
            const imageElement = await getElement(card, AMAZON_SELECTORS.image);
            const ratingElement = await getElement(card, AMAZON_SELECTORS.rating);
            const linkElement = await getElement(card, AMAZON_SELECTORS.link);

            
            const price = cleanPrice(
                (await priceElement?.innerText()) || ""
            );
            // Skip products without a valid price
            if (!price) {
                continue;
            }

            
            // Handle lazy-loaded images
            const image = await getImage(imageElement);

   
            // Clean URL
            const url = await getUrl(linkElement, "https://www.amazon.in");


            products.push({
                store: "Amazon",

                title: cleanText(
                    (await titleElement?.innerText()) || ""
                ),

                price,

                image,

                url,

                rating: cleanText(
                    (await ratingElement?.innerText()) || ""
                ),
            });
        }
        return products;
    }
    catch (error) {
        console.error("Amazon Scraper Error:", error.message);
        return [];
    }
};
