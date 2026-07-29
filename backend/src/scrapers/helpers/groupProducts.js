/**
 * groupProducts.js
 *
 * Takes a flat array of normalized products (from all stores) and groups them
 * into "product cards" — each card represents one distinct product that may
 * be available across multiple stores at different prices.
 *
 * ── Grouping logic ───────────────────────────────────────────────────────────
 *
 * Step 1 — Hard match (exact variantKey)
 *   Products whose titleParser variantKey is identical are definitively
 *   the same product. This handles the case where Amazon and Flipkart both
 *   list "Apple iPhone 15 128GB Midnight" — they'll share the same key
 *   "apple iphone 15 128gb" (colour stripped).
 *
 * Step 2 — Soft match (Jaccard token similarity)
 *   For products whose variantKey didn't exact-match anything, we compute
 *   token overlap against existing group representatives. If the overlap
 *   exceeds SOFT_THRESHOLD the product joins that group. This handles
 *   slight title wording differences across stores.
 *   e.g. "Apple iPhone 15 (128 GB)" vs "Apple iPhone 15 128GB"
 *
 * ── Colour collapsing ────────────────────────────────────────────────────────
 *   Within a group, the distinct colours found across all product listings
 *   are collected into `availableColors`. This lets the frontend show
 *   "Available in: Black, Blue, Midnight" on a single card.
 *
 * ── Per-group stats ──────────────────────────────────────────────────────────
 *   lowestPrice / highestPrice / savings
 *   avgRating (average of stores that have a rating > 0)
 *   totalReviews (sum across all stores)
 *   storeCount
 *   lowestStore (name of the cheapest store)
 *
 * ── Output shape (one object per group) ─────────────────────────────────────
 * {
 *   id:                   String   — URL-safe slug
 *   title:                String   — best (longest) title across stores
 *   image:                String   — best image URL
 *   brand:                String
 *   attributes:           Object   — { storage, ram, screenSize, weight, … }
 *   availableColors:      String[] — e.g. ["Black", "Blue", "Midnight"]
 *   lowestPrice:          Number
 *   highestPrice:         Number
 *   formattedLowestPrice: String   — "₹79,999"
 *   savings:              Number
 *   formattedSavings:     String
 *   avgRating:            Number
 *   totalReviews:         Number
 *   storeCount:           Number
 *   lowestStore:          String
 *   stores: [
 *     {
 *       store:          String
 *       storeId:        String
 *       price:          Number
 *       formattedPrice: String
 *       url:            String
 *       rating:         Number
 *       reviewCount:    Number
 *       image:          String
 *       isLowest:       Boolean
 *       scrapedAt:      String
 *     }
 *   ]
 * }
 */

import { parseTitle } from "./titleParser.js";
import { formatINR }  from "./normalizeProduct.js";

// ─── Tuning constants ──────────────────────────────────────────────────────
const SOFT_THRESHOLD = 0.35;   // Jaccard similarity to trigger a soft match
const MIN_TOKEN_LEN  = 2;      // ignore tokens shorter than this

// ─── Token utilities ───────────────────────────────────────────────────────

const tokenize = (str) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length >= MIN_TOKEN_LEN);

const jaccard = (a, b) => {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    a.forEach((t) => { if (b.has(t)) inter++; });
    return inter / (a.size + b.size - inter);
};

// ─── Slug builder ──────────────────────────────────────────────────────────

const slugify = (str) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

// ─── Pick the best representative value from a list ───────────────────────

/** Longest non-empty string (best title / most descriptive). */
const best = (arr) => arr.reduce((a, b) => (b.length > a.length ? b : a), "");

/** First non-empty string (best image URL). */
const firstNonEmpty = (arr) => arr.find((v) => v) ?? "";

// ─── Capitalise first letter of each word ─────────────────────────────────
const titleCase = (str) =>
    str.replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Main export ───────────────────────────────────────────────────────────

/**
 * @param {object[]} normalizedProducts  — output of normalizeProduct[]
 * @returns {object[]}                   — array of grouped product cards
 */
export const groupProducts = (normalizedProducts = []) => {

    // Each internal group accumulates products that belong together.
    // { variantKey, keyTokens (Set), products [] }
    const groups = [];

    for (const product of normalizedProducts) {
        // Skip products with no usable data
        if (!product.title || !product.price || product.price <= 0) continue;

        const parsed = parseTitle(product.title);

        // Attach parsed info to the product so we don't re-parse later
        product._parsed = parsed;

        const vKey   = parsed.variantKey;
        const tokens = new Set(tokenize(vKey));

        // ── Step 1: exact variantKey match ────────────────────────────────
        let matched = groups.find((g) => g.variantKey === vKey);

        // ── Step 2: soft token-overlap match ─────────────────────────────
        if (!matched) {
            matched = groups.find(
                (g) => jaccard(tokens, g.keyTokens) >= SOFT_THRESHOLD
            );
        }

        if (matched) {
            matched.products.push(product);
            // Grow the representative token set for future comparisons
            tokens.forEach((t) => matched.keyTokens.add(t));
        } else {
            groups.push({ variantKey: vKey, keyTokens: tokens, products: [product] });
        }
    }

    // ─── Build the final output objects ───────────────────────────────────
    return groups.map((group) => {
        const { products } = group;

        // ── Best title & image ─────────────────────────────────────────────
        const title = best(products.map((p) => p.title));
        const image = firstNonEmpty(products.map((p) => p.image));
        const parsedRef = products[0]._parsed;   // representative parsed title

        // ── Colours — collect all distinct colour values across all products
        const colorSet = new Set();
        products.forEach((p) => {
            (p._parsed?.colorTokens ?? []).forEach((c) => colorSet.add(c));
        });
        const availableColors = [...colorSet].map(titleCase);

        // ── Per-store rows ─────────────────────────────────────────────────
        // One row per store — if a store has multiple listings of the same
        // product (e.g. two colours) we keep the cheapest one.
        const storeMap = new Map(); // storeId → best product
        for (const p of products) {
            const existing = storeMap.get(p.storeId);
            if (!existing || p.price < existing.price) {
                storeMap.set(p.storeId, p);
            }
        }

        const storeRows = [...storeMap.values()]
            .sort((a, b) => a.price - b.price)
            .map((p) => ({
                store:          p.store,
                storeId:        p.storeId,
                price:          p.price,
                formattedPrice: p.formattedPrice,
                url:            p.url,
                rating:         p.rating,
                reviewCount:    p.reviewCount,
                image:          p.image,
                isLowest:       false,   // set below after sort
                scrapedAt:      p.scrapedAt,
            }));

        // Mark cheapest store
        if (storeRows.length > 0) storeRows[0].isLowest = true;

        // ── Price stats ────────────────────────────────────────────────────
        const prices       = storeRows.map((s) => s.price);
        const lowestPrice  = Math.min(...prices);
        const highestPrice = Math.max(...prices);
        const savings      = highestPrice - lowestPrice;

        // ── Rating stats ───────────────────────────────────────────────────
        const rated = storeRows.filter((s) => s.rating > 0);
        const avgRating = rated.length
            ? parseFloat(
                (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
              )
            : 0;
        const totalReviews = storeRows.reduce((s, r) => s + r.reviewCount, 0);

        // ── Clean up internal _parsed before returning ────────────────────
        storeRows.forEach((r) => {
            // storeRows are new plain objects, nothing to clean
        });

        return {
            id:                   slugify(title),
            title,
            image,
            brand:                parsedRef?.brand ? titleCase(parsedRef.brand) : "",
            attributes:           parsedRef?.attributes ?? {},
            availableColors,
            lowestPrice,
            highestPrice,
            formattedLowestPrice: formatINR(lowestPrice),
            savings,
            formattedSavings:     formatINR(savings),
            avgRating,
            totalReviews,
            storeCount:           storeRows.length,
            lowestStore:          storeRows[0]?.store ?? "",
            stores:               storeRows,
        };
    });
};
