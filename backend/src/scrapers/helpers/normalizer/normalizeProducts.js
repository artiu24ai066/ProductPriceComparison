import { extractTitleAttributes } from "./titleParser.js";
import { parseNumber, compactObject } from "./utils.js";

export const normalizeProducts = (products = []) => {
    return (products || []).map((product) => {
        const title = (product?.title || "").toString().trim();
        const price = parseNumber(product?.price);
        if (!title || price === null) return null;

        const parsed = extractTitleAttributes(title);
        const normalizedAttributes = parsed.attributes || {};

        return {
            rawTitle: title,
            title,
            normalizedTitle: parsed.normalizedTitle || title,
            canonicalTitle: parsed.canonicalTitle || title,
            canonicalKey: parsed.canonicalKey || parsed.normalizedTitle || title,
            attributes: normalizedAttributes,
            variantAttributes: {
                color: normalizedAttributes.color || null,
                size: normalizedAttributes.size || null,
                storage: normalizedAttributes.storage || null,
                ram: normalizedAttributes.ram || null,
                packSize: normalizedAttributes.packSize || null,
                quantity: normalizedAttributes.quantity || null,
            },
            store: product?.store || null,
            price,
            originalPrice: parseNumber(product?.originalPrice) || null,
            discount: product?.discount ?? null,
            delivery: product?.delivery ?? null,
            rating: parseNumber(product?.rating) ?? null,
            reviewCount: parseNumber(product?.reviewCount) ?? null,
            sellerName: product?.sellerName ?? null,
            url: product?.url ?? null,
            image: product?.image ?? null,
            availability: product?.availability ?? null,
            coupon: product?.coupon ?? null,
            emi: product?.emi ?? null,
            exchangeOffer: product?.exchangeOffer ?? null,
            bankOffer: product?.bankOffer ?? null,
            shipping: product?.shipping ?? null,
            scrapedAt: product?.scrapedAt || new Date().toISOString(),
        };
    }).filter(Boolean);
};
