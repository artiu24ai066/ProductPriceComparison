import { slugify, uniqueValues, parseNumber, compactObject, normalizeWhitespace } from "./utils.js";

const tokenSimilarity = (tokensA = [], tokensB = []) => {
    if (!tokensA.length || !tokensB.length) return 0;
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    let common = 0;
    for (const token of setA) {
        if (setB.has(token)) common += 1;
    }
    return common / Math.min(setA.size, setB.size);
};

const toGroupKey = (normalizedAttributes, canonicalKey) => {
    const parts = [];
    if (normalizedAttributes.brand) parts.push(slugify(normalizedAttributes.brand));
    if (normalizedAttributes.model) parts.push(slugify(normalizedAttributes.model));
    if (normalizedAttributes.storage) parts.push(slugify(normalizedAttributes.storage));
    if (normalizedAttributes.ram) parts.push(slugify(normalizedAttributes.ram));
    if (normalizedAttributes.processor) parts.push(slugify(normalizedAttributes.processor));
    if (normalizedAttributes.screenSize) parts.push(slugify(normalizedAttributes.screenSize));
    if (normalizedAttributes.packSize) parts.push(slugify(normalizedAttributes.packSize));
    if (normalizedAttributes.quantity) parts.push(slugify(normalizedAttributes.quantity));
    if (parts.length) return parts.join("-");
    return slugify(canonicalKey || "");
};

const compatibleVariantAttributes = (a, b) => {
    const discriminators = ["storage", "ram", "processor", "screenSize", "packSize", "quantity", "weight", "size"];
    for (const key of discriminators) {
        if (a?.[key] && b?.[key] && a[key] !== b[key]) {
            return false;
        }
    }
    return true;
};

const mergeAttributes = (base = {}, extra = {}) => {
    const result = { ...base };
    for (const key of Object.keys(extra)) {
        if ((result[key] === undefined || result[key] === null) && extra[key] != null) {
            result[key] = extra[key];
        }
    }
    return result;
};

const buildSeller = (product) => ({
    website: product.store || null,
    title: product.rawTitle || product.title || null,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    delivery: product.delivery,
    rating: product.rating,
    reviewCount: product.reviewCount,
    sellerName: product.sellerName,
    url: product.url,
    affiliateUrl: null,
    availability: product.availability || (product.price != null ? "In Stock" : "Unavailable"),
    image: product.image,
    coupon: product.coupon,
    emi: product.emi,
    exchangeOffer: product.exchangeOffer,
    bankOffer: product.bankOffer,
    shipping: product.shipping,
    scrapedAt: product.scrapedAt,
});

const findBestSeller = (sellers, comparator) => sellers.reduce((best, seller) => {
    if (!best) return seller;
    if (comparator(seller, best)) return seller;
    return best;
}, null);

export const groupProducts = (products = []) => {
    const normalized = (products || []).map((product) => ({
        product,
        tokens: slugify(product.canonicalTitle || product.normalizedTitle || product.title || product.rawTitle || "").split("-").filter(Boolean),
        attributes: product.attributes || {},
    }));

    const groups = [];

    for (const item of normalized) {
        let matchedGroup = null;
        for (const group of groups) {
            const similarity = tokenSimilarity(item.tokens, group.tokens);
            if (similarity >= 0.65 && compatibleVariantAttributes(item.attributes, group.attributes)) {
                matchedGroup = group;
                break;
            }
        }

        if (matchedGroup) {
            matchedGroup.items.push(item.product);
            matchedGroup.tokens = uniqueValues([...matchedGroup.tokens, ...item.tokens]);
            matchedGroup.attributes = mergeAttributes(matchedGroup.attributes, item.attributes);
        } else {
            groups.push({
                key: toGroupKey(item.attributes, item.product.canonicalKey),
                tokens: item.tokens,
                attributes: item.attributes,
                items: [item.product],
            });
        }
    }

    return groups.map((group) => {
        const sellers = group.items.map(buildSeller);
        const prices = sellers.map((seller) => seller.price).filter((price) => price != null);
        const lowest = prices.length ? Math.min(...prices) : null;
        const highest = prices.length ? Math.max(...prices) : null;
        const average = prices.length ? Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length) : null;
        const difference = lowest != null && highest != null ? highest - lowest : null;
        const lowestPriceSeller = findBestSeller(sellers, (a, b) => a.price != null && (b.price == null || a.price < b.price));
        const highestPriceSeller = findBestSeller(sellers, (a, b) => a.price != null && (b.price == null || a.price > b.price));
        const cheapestAvailableSeller = findBestSeller(sellers, (a, b) => {
            const inStockA = a.availability?.toLowerCase().includes("in stock");
            const inStockB = b.availability?.toLowerCase().includes("in stock");
            if (inStockA && !inStockB) return true;
            if (!inStockA && inStockB) return false;
            if (a.price == null) return false;
            if (b.price == null) return true;
            return a.price < b.price;
        });
        const bestDiscountSeller = findBestSeller(sellers, (a, b) => {
            const da = parseNumber(a.discount) || 0;
            const db = parseNumber(b.discount) || 0;
            return da > db;
        });

        const canonicalTitle = normalizeWhitespace([
            group.attributes.brand,
            group.attributes.model,
            group.attributes.storage,
            group.attributes.ram,
            group.attributes.processor,
        ]
            .filter(Boolean)
            .join(" ") || group.items[0].canonicalTitle || group.items[0].normalizedTitle || group.items[0].title);
        const groupId = slugify(group.key || canonicalTitle);

        const colors = uniqueValues(group.items.map((item) => item.variantAttributes?.color).filter(Boolean));
        const sizes = uniqueValues(group.items.map((item) => item.variantAttributes?.size).filter(Boolean));

        return {
            groupId,
            canonicalTitle,
            brand: group.attributes.brand || null,
            category: null,
            subcategory: null,
            attributes: compactObject({
                brand: group.attributes.brand,
                model: group.attributes.model,
                storage: group.attributes.storage,
                ram: group.attributes.ram,
                processor: group.attributes.processor,
                screenSize: group.attributes.screenSize,
                weight: group.attributes.weight,
                packSize: group.attributes.packSize,
                quantity: group.attributes.quantity,
                colorOptions: colors.length ? colors : undefined,
                sizeOptions: sizes.length ? sizes : undefined,
            }),
            variants: compactObject({
                colors,
                sizes,
            }),
            priceStats: compactObject({
                lowest,
                highest,
                average,
                difference,
                discountPercentage: null,
            }),
            lowestPriceSeller: lowestPriceSeller ? compactObject(lowestPriceSeller) : null,
            highestPriceSeller: highestPriceSeller ? compactObject(highestPriceSeller) : null,
            bestDiscountSeller: bestDiscountSeller ? compactObject(bestDiscountSeller) : null,
            cheapestAvailableSeller: cheapestAvailableSeller ? compactObject(cheapestAvailableSeller) : null,
            sellers,
            specifications: {},
            priceHistory: [],
            aiPrediction: {},
            reviewSummary: {},
            discountAnalysis: {},
            images: {
                primary: uniqueValues(group.items.map((item) => item.image))[0] || null,
                gallery: uniqueValues(group.items.map((item) => item.image).filter(Boolean)),
            },
            availability: cheapestAvailableSeller?.availability || sellers[0]?.availability || null,
            lastUpdated: new Date().toISOString(),
        };
    });
};
