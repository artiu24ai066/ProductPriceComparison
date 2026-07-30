import { slugify, uniqueValues, parseNumber, compactObject, normalizeWhitespace } from "./utils.js";

const toGroupKey = (normalizedAttributes, canonicalKey) => {
    const parts = [];
    if (normalizedAttributes.brand) parts.push(slugify(normalizedAttributes.brand));
    if (normalizedAttributes.model) parts.push(slugify(normalizedAttributes.model));
    if (normalizedAttributes.storage) parts.push(slugify(normalizedAttributes.storage));
    if (normalizedAttributes.ram) parts.push(slugify(normalizedAttributes.ram));
    if (normalizedAttributes.processor) parts.push(slugify(normalizedAttributes.processor));
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

const dedupeProducts = (products = []) => {
    const seen = new Set();
    return (products || []).filter((product) => {
        const color = product.variantAttributes?.color || "";
        const size = product.variantAttributes?.size || "";
        const dedupeKey = slugify([
            product.store || "",
            product.canonicalKey || product.normalizedTitle || product.title || "",
            product.url || "",
            color,
            size,
        ].join(" "));
        if (seen.has(dedupeKey)) return false;
        seen.add(dedupeKey);
        return true;
    });
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
    sellerName: product.sellerName || null,
    title: product.rawTitle || product.title || null,
    price: product.price,
    currentPrice: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    coupon: product.coupon,
    delivery: product.delivery,
    shipping: product.shipping,
    emi: product.emi,
    exchangeOffer: product.exchangeOffer,
    bankOffer: product.bankOffer,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stockStatus: product.availability || (product.price != null ? "In Stock" : "Unavailable"),
    availability: product.availability || (product.price != null ? "In Stock" : "Unavailable"),
    url: product.url,
    affiliateUrl: null,
    image: product.image,
    scrapedAt: product.scrapedAt,
});

const normalizeSellerUrl = (rawUrl = "", website = "") => {
    if (!rawUrl) return "";
    let normalized = rawUrl.toString().trim();

    try {
        const url = new URL(normalized);
        normalized = `${url.origin}${url.pathname}`;
    } catch (error) {
        normalized = normalized.replace(/[#?].*$/, "");
    }

    normalized = normalized.replace(/\/+$/, "");

    if (/amazon\./i.test(website) || /amazon\./i.test(normalized)) {
        normalized = normalized.replace(/\/ref=.*$/i, "");
        normalized = normalized.replace(/\/gp\/product\/([A-Z0-9]+)/i, "/gp/product/$1");
        normalized = normalized.replace(/\/dp\/([A-Z0-9]+)/i, "/dp/$1");
    }

    if (/flipkart\./i.test(website) || /flipkart\./i.test(normalized)) {
        normalized = normalized.replace(/\/p\/itm[^\/]+(?:\/.*)?$/i, (match) => match.split("/")[0] + "/" + match.split("/")[1]);
        normalized = normalized.replace(/\/ref=.*$/i, "");
    }

    normalized = normalized.replace(/\/ref=.*$/i, "");
    normalized = normalized.replace(/\/sr_[^\/]+$/i, "");
    normalized = normalized.replace(/\?.*$/, "");
    normalized = normalized.replace(/#.*$/, "");

    return normalized;
};

const getSellerKey = (seller) => {
    if (!seller) return "";
    const urlSegment = normalizeSellerUrl(seller.url, seller.website);
    if (urlSegment) return slugify([seller.website, urlSegment].filter(Boolean).join(" "));
    return slugify([
        seller.website,
        seller.sellerName,
        seller.title,
        seller.price,
        seller.image,
    ]
        .filter(Boolean)
        .join(" "));
};

const dedupeSellers = (sellers = []) => {
    const seen = new Set();
    return (sellers || []).filter((seller) => {
        const key = getSellerKey(seller);
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const findBestSeller = (sellers, comparator) => sellers.reduce((best, seller) => {
    if (!best) return seller;
    if (comparator(seller, best)) return seller;
    return best;
}, null);

export const groupProducts = (products = []) => {
    const deduped = dedupeProducts(products);
    const normalized = (deduped || []).map((product) => ({
        product,
        tokens: slugify(product.canonicalTitle || product.normalizedTitle || product.title || product.rawTitle || "").split("-").filter(Boolean),
        attributes: product.attributes || {},
    }));

    const groupsByKey = new Map();

    for (const item of normalized) {
        const itemKey = toGroupKey(item.attributes, item.product.canonicalKey) || slugify(item.product.canonicalKey || item.product.normalizedTitle || item.product.title || item.product.rawTitle || "");
        if (!groupsByKey.has(itemKey)) {
            groupsByKey.set(itemKey, {
                key: itemKey,
                tokens: item.tokens,
                attributes: item.attributes,
                items: [item.product],
            });
            continue;
        }

        const group = groupsByKey.get(itemKey);
        group.items.push(item.product);
        group.tokens = uniqueValues([...group.tokens, ...item.tokens]);
        group.attributes = mergeAttributes(group.attributes, item.attributes);
    }

    const groups = Array.from(groupsByKey.values());

    return groups.map((group) => {
        const rawSellers = group.items.map(buildSeller);
        const sellers = dedupeSellers(rawSellers);
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
        const variantMap = new Map();
        for (const item of group.items) {
            const color = item.variantAttributes?.color || null;
            const size = item.variantAttributes?.size || null;
            const variantKey = slugify([color, size].filter(Boolean).join("-").trim()) || "default";
            if (!variantMap.has(variantKey)) {
                variantMap.set(variantKey, {
                    variantId: variantKey,
                    color,
                    size,
                    images: [],
                    sellers: [],
                });
            }
            const variant = variantMap.get(variantKey);
            if (item.image) {
                variant.images = uniqueValues([...variant.images, item.image]);
            }
            variant.sellers.push(buildSeller(item));
        }

        for (const variant of variantMap.values()) {
            variant.sellers = dedupeSellers(variant.sellers);
        }

        const matchedFields = [];
        if (group.attributes.brand) matchedFields.push("brand");
        if (group.attributes.model) matchedFields.push("model");
        if (group.attributes.storage) matchedFields.push("storage");
        if (group.attributes.ram) matchedFields.push("ram");
        if (group.attributes.processor) matchedFields.push("processor");

        const sellerImages = group.items.reduce((map, item) => {
            if (!item.store || !item.image) return map;
            map[item.store] = uniqueValues([...(map[item.store] || []), item.image]);
            return map;
        }, {});

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
            variantOptions: compactObject({
                colors,
                sizes,
            }),
            variants: Array.from(variantMap.values()).map((variant) => compactObject({
                variantId: variant.variantId,
                color: variant.color,
                size: variant.size,
                images: variant.images,
                sellers: variant.sellers.map((seller) => compactObject(seller)),
            })),
            searchTokens: uniqueValues(group.tokens),
            matching: compactObject({
                confidence: matchedFields.includes("brand") && matchedFields.includes("model") && matchedFields.includes("storage") ? 98 : 75,
                matchedFields: matchedFields.length ? matchedFields : undefined,
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
            specifications: compactObject({
                display: group.attributes.screenSize,
                processor: group.attributes.processor,
                ram: group.attributes.ram,
                storage: group.attributes.storage,
                weight: group.attributes.weight,
                packSize: group.attributes.packSize,
                quantity: group.attributes.quantity,
            }),
            priceHistory: [],
            aiPrediction: {},
            reviewSummary: {},
            discountAnalysis: {},
            images: compactObject({
                primary: uniqueValues(group.items.map((item) => item.image))[0] || null,
                gallery: uniqueValues(group.items.map((item) => item.image).filter(Boolean)),
                sellerImages: Object.keys(sellerImages).length ? sellerImages : undefined,
            }),
            availability: cheapestAvailableSeller?.availability || sellers[0]?.availability || null,
            lastUpdated: new Date().toISOString(),
        };
    });
};
