import { normalizeWhitespace, tokenize, slugify } from "./utils.js";

const COLOR_WORDS = [
    "black", "white", "blue", "red", "green", "yellow", "pink", "purple", "gray", "grey", "brown",
    "orange", "silver", "gold", "beige", "maroon", "navy", "tan", "ivory", "burgundy", "teal",
    "violet", "cyan", "magenta", "bronze", "mint", "peach", "lavender", "cream", "ultramarine",
];

const BRAND_ALIASES = {
    apple: "Apple",
    iphone: "Apple",
    samsung: "Samsung",
    oneplus: "OnePlus",
    realme: "Realme",
    vivo: "Vivo",
    oppo: "Oppo",
    poco: "POCO",
    xiaomi: "Xiaomi",
    google: "Google",
    nokia: "Nokia",
    motorola: "Motorola",
    lenovo: "Lenovo",
    asus: "ASUS",
    acer: "Acer",
    hp: "HP",
};

const MARKETING_TERMS = [
    "with", "for", "by", "from", "in", "on", "to", "and", "plus", "promo", "promotion", "powered",
    "improved", "best", "battery", "camera", "display", "screen", "front", "back", "water", "proof",
    "oxide", "series", "edition", "version", "smart", "wireless", "charger", "headphone", "headphones",
    "headset", "cable", "adapter", "case", "cover", "group", "selfies", "scratch", "resistance", "life",
    "always", "everyday", "new", "latest", "official", "genuine", "quality", "sale", "offer", "deal",
];

const UNIT_PATTERNS = [
    { key: "storage", regex: /(\d+(?:\.\d+)?)\s*(tb|gb|mb|kb)\b/i },
    { key: "ram", regex: /(\d+(?:\.\d+)?)\s*(gb|mb|kb)\s*ram\b/i },
    { key: "screenSize", regex: /(\d+(?:\.\d+)?)\s*(?:inch|in|cm|mm)\b/i },
    { key: "weight", regex: /(\d+(?:\.\d+)?)\s*(?:kg|g|gram|grams)\b/i },
    { key: "packSize", regex: /pack(?:\s*of)?\s*(\d+)/i },
    { key: "quantity", regex: /(\d+)\s*(?:pcs|pieces|units|count)\b/i },
    { key: "storage", regex: /(\d+(?:\.\d+)?)\s*(?:rom)\b/i },
];

const PROCESSOR_PATTERNS = [
    /(apple\s*a\d+[x]?)/i,
    /(apple\s*m\d+[x]?)/i,
    /(intel\s*i[3579]-?\d+)/i,
    /(amd\s*ryzen\s*\d+)/i,
    /(snapdragon\s*\d+)/i,
];

const removeMatches = (text, patterns) =>
    patterns.reduce((result, pattern) => result.replace(pattern, " "), text).replace(/\s+/g, " ").trim();

const isVariantToken = (token) => {
    const lower = token.toLowerCase();
    return COLOR_WORDS.includes(lower) || /\b(?:tb|gb|mb|kb|cm|mm|inch|in|kg|g|gram|grams|pack|pcs|pieces|units|count|ram|rom)\b/i.test(lower);
};

const isStopToken = (token) => {
    return MARKETING_TERMS.includes(token.toLowerCase());
};

const isNumericToken = (token) => /^\d+$/.test(token);

const shouldStopModel = (token, nextToken) => {
    const lower = token.toLowerCase();
    if (isVariantToken(token)) return true;
    if (isStopToken(token)) return true;
    if (isNumericToken(token) && nextToken) {
        return /^(tb|gb|mb|kb|ram|pack|pcs|pieces|units|count|kg|g|gram|grams|inch|in|cm|mm|rom)$/.test(nextToken.toLowerCase());
    }
    return false;
};

export const extractTitleAttributes = (rawTitle) => {
    const title = normalizeWhitespace(rawTitle || "");
    const baseTitle = title.split(/[:\-–—]/)[0].trim();
    const tokens = tokenize(baseTitle);

    const result = {
        brand: null,
        model: null,
        storage: null,
        ram: null,
        processor: null,
        screenSize: null,
        weight: null,
        packSize: null,
        quantity: null,
        color: null,
    };

    for (const color of COLOR_WORDS) {
        const regex = new RegExp(`\\b${color}\\b`, "i");
        if (regex.test(title)) {
            result.color = color.charAt(0).toUpperCase() + color.slice(1);
            break;
        }
    }

    for (const pattern of UNIT_PATTERNS) {
        const match = pattern.regex.exec(title);
        if (!match) continue;
        const rawValue = match[0].trim();
        const value = rawValue.replace(/\s+/g, " ");
        if (pattern.key === "screenSize") {
            result.screenSize = result.screenSize || value;
        } else if (pattern.key === "storage") {
            result.storage = result.storage || value.toUpperCase().replace(/\s+/g, "");
        } else if (pattern.key === "ram") {
            result.ram = result.ram || value.toUpperCase().replace(/\s+/g, " ");
        } else if (pattern.key === "weight") {
            result.weight = result.weight || value.toUpperCase().replace(/\s+/g, "");
        } else if (pattern.key === "packSize") {
            result.packSize = result.packSize || value.toLowerCase();
        } else if (pattern.key === "quantity") {
            result.quantity = result.quantity || value.toLowerCase();
        }
    }

    for (const pattern of PROCESSOR_PATTERNS) {
        const match = pattern.exec(title);
        if (match) {
            result.processor = match[0].replace(/\s+/g, " ");
            break;
        }
    }

    if (!tokens.length) {
        return {
            normalizedTitle: "",
            canonicalTitle: "",
            canonicalKey: "",
            attributes: result,
            tokens: [],
        };
    }

    const firstToken = tokens[0];
    const brandCandidate = BRAND_ALIASES[firstToken?.toLowerCase()] || null;
    if (brandCandidate) {
        result.brand = brandCandidate;
    } else if (!/^\d+$/.test(firstToken) && !isStopToken(firstToken)) {
        result.brand = firstToken.charAt(0).toUpperCase() + firstToken.slice(1);
    }

    const normalizeModelToken = (token) => {
        const lower = token.toLowerCase();
        const special = {
            iphone: "iPhone",
            pro: "Pro",
            max: "Max",
            ultra: "Ultra",
            air: "Air",
            mini: "Mini",
            plus: "Plus",
            se: "SE",
            xl: "XL",
            xs: "XS",
            xr: "XR",
        };
        return special[lower] || token.charAt(0).toUpperCase() + token.slice(1);
    };

    const modelParts = [];
    for (let i = 1; i < tokens.length; i += 1) {
        const token = tokens[i];
        const nextToken = tokens[i + 1] || "";
        if (shouldStopModel(token, nextToken)) break;
        modelParts.push(token);
    }

    if (modelParts.length) {
        const normalizedModel = modelParts.map(normalizeModelToken).join(" ");
        if (firstToken?.toLowerCase() === "iphone" && result.brand === "Apple") {
            result.model = `iPhone ${normalizedModel}`;
        } else {
            result.model = normalizedModel;
        }
    }

    const canonicalParts = [];
    if (result.brand) canonicalParts.push(result.brand);
    if (result.model) canonicalParts.push(result.model);
    if (result.storage) canonicalParts.push(result.storage);
    if (result.ram) canonicalParts.push(result.ram);
    if (result.processor) canonicalParts.push(result.processor);
    if (result.packSize) canonicalParts.push(result.packSize);
    if (result.quantity) canonicalParts.push(result.quantity);

    const canonicalTitle = canonicalParts.join(" ");
    const canonicalTokens = tokenize(canonicalTitle).filter((token) => !isVariantToken(token) && !isStopToken(token));

    return {
        normalizedTitle: normalizeWhitespace(canonicalTitle),
        canonicalTitle: normalizeWhitespace(canonicalTitle),
        canonicalKey: slugify(canonicalTitle),
        attributes: result,
        tokens: canonicalTokens,
    };
};
