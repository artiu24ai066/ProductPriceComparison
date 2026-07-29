/**
 * scraperManager.js
 *
 * Orchestrates all three store scrapers in parallel, then pipes the raw
 * results through the cleaning pipeline:
 *
 *   raw products  →  normalizeProduct()  →  groupProducts()  →  API response
 *
 * The final response shape is an array of grouped product cards.
 * Each card represents one distinct product available across 1-3 stores.
 *
 * Frontend reads: response.data.data  →  array of grouped cards
 */

import { createContext, closeBrowser } from "./config/browser.js";

import { scrapeAmazon }   from "./amazon/amazon.scraper.js";
import { scrapeFlipkart } from "./flipkart/flipkart.scraper.js";
import { scrapeReliance } from "./reliance/reliance.scraper.js";

import { normalizeProduct } from "./helpers/normalizeProduct.js";
import { groupProducts }    from "./helpers/groupProducts.js";

export const scrapeAllStores = async (query) => {

    // ── Open one isolated browser context per store ──────────────────────
    // Isolated contexts prevent cookies / sessions leaking between stores.
    const [amazonCtx, flipkartCtx, relianceCtx] = await Promise.all([
        createContext(),
        createContext(),
        createContext(),
    ]);

    try {
        const [amazonPage, flipkartPage, reliancePage] = await Promise.all([
            amazonCtx.newPage(),
            flipkartCtx.newPage(),
            relianceCtx.newPage(),
        ]);

        // ── Scrape all three stores concurrently ─────────────────────────
        // Promise.allSettled ensures one failing store doesn't block the others.
        const [amazonResult, flipkartResult, relianceResult] = await Promise.allSettled([
            scrapeAmazon(amazonPage, query),
            scrapeFlipkart(flipkartPage, query),
            scrapeReliance(reliancePage, query),
        ]);

        // ── Collect raw products, logging any store failures ─────────────
        const rawProducts = [];

        if (amazonResult.status === "fulfilled") {
            rawProducts.push(...amazonResult.value);
        } else {
            console.error("[scraperManager] Amazon failed:", amazonResult.reason?.message);
        }

        if (flipkartResult.status === "fulfilled") {
            rawProducts.push(...flipkartResult.value);
        } else {
            console.error("[scraperManager] Flipkart failed:", flipkartResult.reason?.message);
        }

        if (relianceResult.status === "fulfilled") {
            rawProducts.push(...relianceResult.value);
        } else {
            console.error("[scraperManager] Reliance failed:", relianceResult.reason?.message);
        }

        console.log(`[scraperManager] Raw products collected: ${rawProducts.length}`);

        // ── Step 1: Normalize ────────────────────────────────────────────
        // Clean every raw product: canonical store names, typed fields,
        // formatted prices, parsed ratings and review counts.
        const normalized = rawProducts
            .map((raw) => {
                try {
                    return normalizeProduct(raw);
                } catch (err) {
                    console.warn("[scraperManager] normalizeProduct failed for a product:", err.message);
                    return null;
                }
            })
            .filter(Boolean);  // drop any that threw

        console.log(`[scraperManager] Normalized: ${normalized.length}`);

        // ── Step 2: Group ────────────────────────────────────────────────
        // Combine same products from different stores into one card.
        // Colour variants are collapsed; storage/RAM/size variants are kept separate.
        const grouped = groupProducts(normalized);

        // Clean up internal _parsed metadata before sending to the client
        grouped.forEach((card) => {
            card.stores.forEach((store) => delete store._parsed);
        });

        console.log(`[scraperManager] Product groups formed: ${grouped.length}`);

        // ── Return final response payload ────────────────────────────────
        // Sorted by number of stores (most widely available first), then
        // by lowest price within the same store count.
        const sorted = grouped.sort((a, b) => {
            if (b.storeCount !== a.storeCount) return b.storeCount - a.storeCount;
            return a.lowestPrice - b.lowestPrice;
        });

        return {
            query,
            totalGroups:  sorted.length,
            totalStores:  countActiveStores(amazonResult, flipkartResult, relianceResult),
            lastUpdated:  new Date().toISOString(),
            products:     sorted,   // ← this is what SearchResults.jsx uses
        };

    } finally {
        // ── Always close contexts, even if scraping failed ────────────────
        await Promise.allSettled([
            amazonCtx.close(),
            flipkartCtx.close(),
            relianceCtx.close(),
        ]);
        await closeBrowser();
    }
};

// ─── Helper: count how many stores returned successfully ──────────────────
const countActiveStores = (...results) =>
    results.filter((r) => r.status === "fulfilled" && r.value.length > 0).length;
