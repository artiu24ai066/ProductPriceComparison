import { tokenize } from "./utils.js";

export const removeIrrelevantProducts = (products, query) => {
    if (!query || !query.toString().trim()) return products;

    const queryTokens = tokenize(query);
    if (!queryTokens.length) return products;

    return (products || []).filter((product) => {
        const title = (product?.title || "").toString();
        const titleTokens = tokenize(title);
        return queryTokens.every((queryToken) => titleTokens.includes(queryToken));
    });
};
