/**
 * titleParser.js
 *
 * Parses a raw product title into structured parts that the grouping logic
 * can compare across stores.
 *
 * Works for any product category — phones, laptops, TVs, appliances,
 * clothing, groceries, beauty, furniture, etc.
 *
 * Output shape:
 * {
 *   original:    String   — cleaned title as-is
 *   normalized:  String   — lowercased, symbols stripped, spaces collapsed
 *   brand:       String   — first recognizable brand word (may be "")
 *   model:       String   — model name / number tokens after the brand
 *   variantKey:  String   — the grouping key: brand + model + hard-variant attrs
 *                           (storage, RAM, size, weight, pack size, etc.)
 *                           Two products with the same variantKey = same product
 *   colorTokens: String[] — detected colour words/phrases (variant-only, not grouping)
 *   attributes:  {
 *     storage:   String   — "128GB", "256GB", "1TB", …  (phones, laptops, SSDs)
 *     ram:       String   — "8GB RAM", "16GB RAM", …
 *     screenSize:String   — "55 inch", "6.1 inch", …
 *     weight:    String   — "1kg", "500g", "5L", …
 *     packSize:  String   — "Pack of 3", "6 pack", …
 *     processor: String   — "M2", "i7-12th Gen", "Snapdragon 8 Gen 2", …
 *     modelNo:   String   — explicit model numbers like "SM-G991B", "MQ0T3HN/A"
 *   }
 * }
 */

// ─── Colour dictionary ─────────────────────────────────────────────────────
// Covers common English colour names plus brand-specific shades.
// Sorted longest → shortest so "midnight black" matches before "black".
const COLOUR_TERMS = [
    // Multi-word brand shades
    "midnight black", "pearl white", "rose gold", "space grey", "space gray",
    "sierra blue", "alpine green", "deep purple", "starlight silver",
    "graphite black", "phantom black", "phantom white", "titanium blue",
    "natural titanium", "black titanium", "white titanium", "desert titanium",
    "glacier white", "coral red", "ocean blue", "sky blue", "navy blue",
    "forest green", "olive green", "mint green", "sage green",
    "lavender purple", "light purple", "dark purple",
    "ember red", "blaze orange", "lemon yellow", "champagne gold",
    "brushed gold", "matte black", "glossy black", "pearl black",
    "ceramic white", "iridescent", "prism crush", "prism blue",
    // Single colour words
    "black", "white", "silver", "gold", "grey", "gray", "blue", "red",
    "green", "yellow", "orange", "purple", "pink", "violet", "brown",
    "beige", "cream", "ivory", "tan", "navy", "teal", "cyan", "magenta",
    "maroon", "coral", "peach", "lilac", "indigo", "aqua", "charcoal",
    "slate", "ash", "midnight", "champagne", "rose", "copper", "bronze",
    "titanium", "platinum", "onyx", "graphite", "obsidian", "starlight",
    "aurora", "glacier", "sand", "stone", "mocha", "caramel",
];

// Regex built once from the dictionary — matches whole words only
const COLOUR_REGEX = new RegExp(
    "\\b(" + COLOUR_TERMS.map((c) => c.replace(/\s+/g, "\\s+")).join("|") + ")\\b",
    "gi"
);

// ─── Variant-defining attribute patterns ─────────────────────────────────
// These patterns extract attributes that DEFINE a distinct product variant.
// Two products with different values for any of these are DIFFERENT products.
const ATTR_PATTERNS = {
    // Storage: 128GB, 256 GB, 1TB, 512GB, 2TB, 64GB
    storage: /\b(\d+)\s*(GB|TB)\b(?!\s*RAM|\s*LPDDR|\s*DDR)/i,

    // RAM: 8GB RAM, 16 GB RAM, 12GB LPDDR5, 8GB DDR4
    ram: /\b(\d+)\s*GB\s*(RAM|LPDDR\d*|DDR\d*)/i,

    // Screen size: 55 inch, 6.1", 43", 13.3 inch, 14-inch
    screenSize: /\b(\d+\.?\d*)\s*[-]?\s*(inch|in\b|")\b/i,

    // Weight / volume for groceries / FMCG: 1kg, 500g, 500gm, 5L, 250ml, 2.5kg
    weight: /\b(\d+\.?\d*)\s*(kg|g\b|gm\b|gms\b|litre|liter|ltr|ml|l\b)/i,

    // Pack size: Pack of 3, 6 pack, Set of 4, combo of 2
    packSize: /\b(pack|set|combo|bundle)\s*(of\s*)?\s*(\d+)\b|\b(\d+)\s*(pack|pcs?|pieces?|units?|count)\b/i,

    // Processor: M1, M2, M3 Pro, i5, i7, i9, Ryzen 5, Snapdragon 8 Gen 2
    processor: /\b(apple\s+m[1-4]\s*(pro|max|ultra)?|intel\s+core\s+i[3579][-\s]?\d{2,5}[a-z]*|ryzen\s+[3579]\s*\d{4}[a-z]*|snapdragon\s+[\w\s]+gen\s*\d+|dimensity\s+\d+|mediatek\s+\w+|exynos\s+\d+|helio\s+\w+)\b/i,

    // Explicit model numbers: alphanumeric codes like SM-G991, MQ0T3HN/A, RZ5-4500U
    modelNo: /\b([A-Z]{1,4}[-/]?[A-Z0-9]{2,}[-/][A-Z0-9]{1,6}[A-Z]?)\b/,
};

// ─── Brand dictionary ──────────────────────────────────────────────────────
// The first token that matches any of these (case-insensitive) is the brand.
// Having a list prevents generic words like "New", "Best", "Pack" from being
// picked as the brand.
const KNOWN_BRANDS = new Set([
    // Electronics
    "apple", "samsung", "sony", "lg", "xiaomi", "redmi", "realme", "oneplus",
    "oppo", "vivo", "motorola", "nokia", "asus", "lenovo", "acer", "hp",
    "dell", "msi", "microsoft", "google", "huawei", "honor", "infinix",
    "tecno", "itel", "lava", "micromax", "jio", "boat", "noise", "zebronics",
    "jbl", "bose", "sennheiser", "skullcandy", "marshall", "anker", "belkin",
    "mi", "poco", "iqoo", "nothing", "whirlpool", "haier", "godrej",
    "panasonic", "philips", "voltas", "daikin", "hitachi", "carrier",
    "bosch", "siemens", "electrolux", "ifb", "lg", "videocon",
    // Fashion & apparel
    "nike", "adidas", "puma", "reebok", "fila", "new balance", "under armour",
    "levis", "wrangler", "arrow", "allen solly", "peter england", "van heusen",
    "raymond", "fabindia", "biba", "w brand", "hm", "zara", "uniqlo",
    "max fashion", "westside", "campus",
    // FMCG / Grocery
    "tata", "nestle", "amul", "britannia", "haldiram", "mdh", "everest",
    "dabur", "himalaya", "patanjali", "marico", "godrej", "hul",
    "hindustan unilever", "p&g", "reckitt", "itc", "emami", "colgate",
    "pepsodent", "sensodyne", "oral-b", "gillette", "nivea", "lakme",
    "maybelline", "loreal", "garnier", "dove", "lux", "lifebuoy",
    "dettol", "savlon",
    // Furniture / Home
    "ikea", "durian", "pepperfry", "hometown", "wakefit", "sleepwell",
    "centuary", "springfit",
    // Appliances
    "pigeon", "prestige", "hawkins", "butterfly", "bajaj", "crompton",
    "havells", "orient", "usha", "v-guard", "polycab",
]);

// ─── Stop-words — tokens stripped before building the model string ─────────
const STOP_WORDS = new Set([
    "with", "for", "and", "the", "new", "latest", "best", "buy", "offer",
    "combo", "free", "gift", "edition", "version", "model", "type",
    "original", "genuine", "official", "certified", "compatible", "smart",
    "premium", "pro", "max", "plus", "ultra", "lite", "mini", "standard",
    "basic", "classic", "exclusive", "limited", "special", "india",
    "warranty", "year", "months", "days", "included", "pack",
]);

// ─── Helpers ───────────────────────────────────────────────────────────────

const normalize = (str) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const extractAttr = (title, key) => {
    const match = title.match(ATTR_PATTERNS[key]);
    return match ? match[0].replace(/\s+/g, " ").trim() : "";
};

/**
 * Extract all colour mentions from the title.
 * Returns an array of unique canonical colour strings (lowercased).
 */
const extractColors = (title) => {
    const found = new Set();
    let m;
    // Reset regex state
    COLOUR_REGEX.lastIndex = 0;
    while ((m = COLOUR_REGEX.exec(title)) !== null) {
        found.add(m[1].toLowerCase().replace(/\s+/g, " "));
    }
    return [...found];
};

/**
 * Strip colour words from a string.
 * Used to build the colour-agnostic model string.
 */
const stripColors = (str) => {
    COLOUR_REGEX.lastIndex = 0;
    return str.replace(COLOUR_REGEX, " ").replace(/\s+/g, " ").trim();
};

/**
 * Detect brand from the first tokens of the title.
 * Checks up to the first 3 words (brands can be 2 words: "New Balance").
 */
const detectBrand = (tokens) => {
    // Try 2-word brand first
    if (tokens.length >= 2) {
        const two = tokens[0] + " " + tokens[1];
        if (KNOWN_BRANDS.has(two)) return { brand: two, rest: tokens.slice(2) };
    }
    // Single-word brand
    if (KNOWN_BRANDS.has(tokens[0])) {
        return { brand: tokens[0], rest: tokens.slice(1) };
    }
    // Unknown brand — use first token anyway (it's likely the brand)
    return { brand: tokens[0] ?? "", rest: tokens.slice(1) };
};

// ─── Main export ───────────────────────────────────────────────────────────

/**
 * @param {string} rawTitle
 * @returns {object} Parsed title parts
 */
export const parseTitle = (rawTitle = "") => {
    const original   = rawTitle.trim();
    const normalized = normalize(original);

    // ── 1. Extract structured attributes from the normalized title ────────
    const storage    = extractAttr(normalized, "storage");
    const ram        = extractAttr(normalized, "ram");
    const screenSize = extractAttr(normalized, "screenSize");
    const weight     = extractAttr(normalized, "weight");
    const packSize   = extractAttr(normalized, "packSize");
    const processor  = extractAttr(normalized, "processor");
    const modelNo    = extractAttr(normalized, "modelNo");

    // ── 2. Extract colours ────────────────────────────────────────────────
    const colorTokens = extractColors(normalized);

    // ── 3. Strip colours to build a colour-agnostic base ─────────────────
    const withoutColors = stripColors(normalized);

    // ── 4. Tokenize and detect brand ──────────────────────────────────────
    const tokens = withoutColors
        .split(" ")
        .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));

    const { brand, rest } = detectBrand(tokens);

    // ── 5. Model = remaining significant tokens (not stop-words) ─────────
    // We also strip the individual attribute values that are already captured
    // so the model string stays clean and comparable.
    const capturedAttrs = [storage, ram, screenSize, weight, packSize, processor, modelNo]
        .filter(Boolean)
        .map(normalize);

    const modelTokens = rest.filter((t) => {
        if (STOP_WORDS.has(t)) return false;
        // drop tokens that are already captured as a structured attribute
        if (capturedAttrs.some((a) => a.includes(t) || t === a)) return false;
        return true;
    });

    const model = modelTokens.slice(0, 6).join(" "); // cap at 6 tokens

    // ── 6. Build the variant key ───────────────────────────────────────────
    // This is the string two products must share to be considered the SAME product.
    // It is: brand + model + ALL hard-variant attributes joined in a canonical order.
    // Colour is intentionally excluded — different colours = same product group.
    const hardAttrs = [storage, ram, screenSize, weight, packSize, processor]
        .filter(Boolean)
        .map((a) => normalize(a))
        .sort()           // canonical order so "8GB RAM 128GB" == "128GB 8GB RAM"
        .join(" ");

    const variantKey = [brand, model, hardAttrs]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    return {
        original,
        normalized,
        brand,
        model,
        variantKey: variantKey || normalized, // fallback to full normalized if empty
        colorTokens,
        attributes: { storage, ram, screenSize, weight, packSize, processor, modelNo },
    };
};
