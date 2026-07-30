import { compactObject, uniqueValues, slugify } from "./utils.js";

const averageRating = (sellers) => {
    const ratings = sellers.map((seller) => seller.rating).filter((r) => typeof r === "number");
    if (!ratings.length) return null;
    return Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1));
};

const normalizeCss = (value) => value;

export const formatForFrontend = (groups = []) => {
    return (groups || []).map((group) => {
        const sellers = group.sellers || [];
        const allRatings = sellers.map((seller) => seller.rating).filter((rating) => typeof rating === "number");
        const overallRating = allRatings.length ? Number((allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length).toFixed(1)) : null;

        return compactObject({
            groupId: slugify(group.groupId || group.canonicalTitle),
            canonicalTitle: group.canonicalTitle,
            brand: group.brand,
            category: group.category,
            subcategory: group.subcategory,
            attributes: compactObject(group.attributes),
            variants: compactObject(group.variants),
            priceStats: compactObject(group.priceStats),
            lowestPriceSeller: compactObject(group.lowestPriceSeller),
            highestPriceSeller: compactObject(group.highestPriceSeller),
            bestDiscountSeller: compactObject(group.bestDiscountSeller),
            cheapestAvailableSeller: compactObject(group.cheapestAvailableSeller),
            sellers: sellers.map((seller) => compactObject(seller)),
            specifications: group.specifications || {},
            priceHistory: group.priceHistory || [],
            aiPrediction: group.aiPrediction || {},
            reviewSummary: group.reviewSummary || {},
            discountAnalysis: group.discountAnalysis || {},
            availability: group.availability,
            images: compactObject({
                primary: group.images?.primary,
                gallery: uniqueValues(group.images?.gallery || []),
            }),
            overallRating: overallRating || null,
            lastUpdated: group.lastUpdated,
        });
    });
};
