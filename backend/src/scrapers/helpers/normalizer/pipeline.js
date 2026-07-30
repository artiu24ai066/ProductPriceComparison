import { removeInvalidProducts } from "./removeInvalidProducts.js";
import { removeIrrelevantProducts } from "./removeIrrelevantProducts.js";
import { normalizeProducts } from "./normalizeProducts.js";
import { groupProducts } from "./groupProducts.js";
import { formatForFrontend } from "./formatForFrontend.js";

export const processProducts = (rawProducts = [], query = "") => {
    let products = removeInvalidProducts(rawProducts || []);
    products = removeIrrelevantProducts(products, query);
    products = normalizeProducts(products);
    const grouped = groupProducts(products);
    return formatForFrontend(grouped);
};
