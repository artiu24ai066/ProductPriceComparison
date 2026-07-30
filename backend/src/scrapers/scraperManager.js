import { createContext, closeBrowser } from "./config/browser.js";

import { scrapeAmazon } from "./amazon/amazon.scraper.js";
import { scrapeFlipkart } from "./flipkart/flipkart.scraper.js";
import { scrapeReliance } from "./reliance/reliance.scraper.js";
import { normalizeTitle } from "./helpers/title/normalizeTitle.js";

const buildVariantGroup = (products = []) => {
    const groups = [];

    products.forEach((product) => {
        let matchedGroup = groups.find((group) => isSameProduct(group, product));

        if (!matchedGroup) {
            groups.push({
                canonicalKey: product.canonicalKey,
                products: [product],
            });
            return;
        }

        matchedGroup.products.push(product);
    });

    return groups.map((group) => {
        const representative = group.products[0];
        const variants = group.products.map((product, index) => ({
            ...product,
            variantId: index + 1,
        }));

        return {
            ...representative,
            variants,
            variantCount: variants.length,
            availableColors: [...new Set(variants.map((variant) => variant.attributes?.color).filter(Boolean))],
            availableSizes: [...new Set(variants.map((variant) => variant.attributes?.size).filter(Boolean))],
            availableCapacities: [...new Set(variants.map((variant) => variant.attributes?.capacity || variant.attributes?.storage).filter(Boolean))],
            availableQuantities: [...new Set(variants.map((variant) => variant.attributes?.quantity).filter(Boolean))],
        };
    });
};

const isSameProduct = (group, product) => {
    if (!group?.canonicalKey || !product?.canonicalKey) return false;

    const baseTokens = new Set(group.canonicalKey.split("-"));
    const productTokens = new Set(product.canonicalKey.split("-"));
    const overlap = [...baseTokens].filter((token) => productTokens.has(token));

    if (!overlap.length) return false;

    const score = overlap.length / Math.max(baseTokens.size, productTokens.size);

    if (score >= 0.5) return true;

    const sharedAttributeValues = [
        group.products[0]?.attributes?.brand,
        group.products[0]?.attributes?.model,
        product.attributes?.brand,
        product.attributes?.model,
    ].filter(Boolean);

    return sharedAttributeValues.length > 0 && sharedAttributeValues[0] === sharedAttributeValues[sharedAttributeValues.length - 1];
};


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

        const normalizedProducts = products.map((product) => {
            const normalized = normalizeTitle(product.title);

            return {
                ...product,
                rawTitle: normalized.rawTitle,
                title: normalized.normalizedTitle || product.title,
                normalizedTitle: normalized.normalizedTitle || product.title,
                titleParts: normalized.titleParts,
                canonicalKey: normalized.canonicalKey,
                attributes: normalized.attributes,
            };
        });

        const groupedProducts = buildVariantGroup(normalizedProducts);

        return {
            query,
            totalProducts: groupedProducts.length,
            totalStores: [...new Set(groupedProducts.map(product => product.store))].length,
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
