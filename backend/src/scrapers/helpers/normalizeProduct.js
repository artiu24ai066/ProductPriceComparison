/**
 * normalizeProduct.js
 *
 * Converts one raw scraped product object into a clean, fully-typed object.
 * Every field is guaranteed present — no undefined or null escapes.
 *
 * Input (what the scrapers produce):
 *   { store, title, price, image, url, rating }
 *
 * Output:
 *   { store, storeId, title, price, formattedPrice,
 *     image, url, rating, reviewCount, inStock, scrapedAt }
 */

import { cleanText } from "./cleanText.js";
import { cleanPrice } from "./cleanPrice.js";

// ─── Canonical store registry ──────────────────────────────────────────────
// Maps any variant of a store name → { display name, slug id }
const STORE_MAP = {
    "amazon":           { name: "Amazon",           id: "amazon"   },
    "flipkart":         { name: "Flipkart",          id: "flipkart" },
    "reliance":         { name: "Reliance Digital",  id: "reliance" },
    "reliance digital": { name: "Reliance Digital",  id: "reliance" },
    "croma":            { name: "Croma",             id: "croma"    },
    "vijay sales":      { name: "Vijay Sales",       id: "vijaysales" },
    "tata cliq":        { name: "Tata CLiQ",         id: "tatacliq" },
    "myntra":           { name: "Myntra",            id: "myntra"   },
    "nykaa":            { name: "Nykaa",             id: "nykaa"    },
    "meesho":           { name: "Meesho",            id: "meesho"   },
    "bigbasket":        { name: "BigBasket",         id: "bigbasket"},
    "blinkit":          { name: "Blinkit",           id: "blinkit"  },
};

const resolveStore = (raw = "") => {
    const key = raw.trim().toLowerCase();
    return STORE_MAP[key] ?? { name: raw.trim() || "Unknown Store", id: key.replace(/\s+/g, "") || "unknown" };
};

// ─── Rating parser ─────────────────────────────────────────────────────────
// Handles: "4.3 out of 5 stars", "4.3", "4.3★", "4.3/5", "Rated 4.3"
const parseRating = (raw) => {
    if (!raw && raw !== 0) return 0;
    if (typeof raw === "number") return clampRating(raw);

    const str = String(raw);
    // Match first decimal or integer number
    const match = str.match(/(\d+\.?\d*)/);
    if (!match) return 0;

    return clampRating(parseFloat(match[1]));
};

const clampRating = (n) => {
    if (isNaN(n) || n < 0) return 0;
    // Some sites rate out of 10 — normalize to 5
    if (n > 5 && n <= 10) return parseFloat((n / 2).toFixed(1));
    if (n > 10) return 5;
    return parseFloat(n.toFixed(1));
};

// ─── Review count parser ───────────────────────────────────────────────────
// Handles: "(18,421)", "18.4K ratings", "18421", "18K+", "2.1M reviews"
const parseReviewCount = (raw) => {
    if (!raw) return 0;
    if (typeof raw === "number") return Math.max(0, Math.round(raw));

    const str = String(raw).replace(/,/g, "").trim();
    const shorthand = str.match(/([\d.]+)\s*([KkMm])\+?/);
    if (shorthand) {
        const num  = parseFloat(shorthand[1]);
        const mult = /[Mm]/.test(shorthand[2]) ? 1_000_000 : 1_000;
        return Math.round(num * mult);
    }
    const plain = str.match(/\d+/);
    return plain ? parseInt(plain[0], 10) : 0;
};

// ─── Indian rupee formatter ────────────────────────────────────────────────
// 124999 → "₹1,24,999"
export const formatINR = (num) => {
    if (!num || isNaN(num) || num <= 0) return "₹0";
    const int = Math.round(num).toString();
    // Indian grouping: last 3 digits, then pairs
    const lastThree = int.slice(-3);
    const rest = int.slice(0, -3);
    const grouped = rest
        ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
        : lastThree;
    return `₹${grouped}`;
};

// ─── Title truncation ──────────────────────────────────────────────────────
const MAX_TITLE = 200;
const truncate = (t) =>
    t.length > MAX_TITLE ? t.slice(0, MAX_TITLE).trimEnd() + "…" : t;

// ─── Main export ───────────────────────────────────────────────────────────

/**
 * @param {object} raw  - One product object from any scraper
 * @returns {object}    - Clean, fully-typed product
 */
export const normalizeProduct = (raw = {}) => {
    const { name: storeName, id: storeId } = resolveStore(raw.store);

    // Price — scraper already runs cleanPrice, so raw.price is a Number.
    // Guard anyway in case something slips through.
    const price =
        typeof raw.price === "number" && raw.price > 0
            ? raw.price
            : (cleanPrice(String(raw.price ?? "")) ?? 0);

    const title = truncate(
        cleanText(typeof raw.title === "string" ? raw.title : "")
    ) || "Unknown Product";

    const image = typeof raw.image === "string" ? raw.image.trim() : "";
    const url   = typeof raw.url   === "string" ? raw.url.trim()   : "";

    return {
        store:          storeName,
        storeId,
        title,
        price,
        formattedPrice: formatINR(price),
        image,
        url,
        rating:         parseRating(raw.rating),
        reviewCount:    parseReviewCount(raw.reviewCount),
        inStock:        true,                     // only listed products are scraped
        scrapedAt:      new Date().toISOString(),
    };
};
