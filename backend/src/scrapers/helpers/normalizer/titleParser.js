import { normalizeWhitespace, tokenize, slugify } from "./utils.js";

const COLOR_WORDS = [
    "black", "white", "blue", "red", "green", "yellow", "pink", "purple", "gray", "grey", "brown",
    "orange", "silver", "gold", "beige", "maroon", "navy", "tan", "ivory", "burgundy", "teal",
    "violet", "cyan", "magenta", "bronze", "mint", "peach", "lavender", "cream",
];

const UNIT_PATTERNS = [
    { key: "storage", regex: /(\d+(?:\.\d+)?)\s*(tb|gb|mb|kb)/i },
    { key: "ram", regex: /(\d+(?:\.\d+)?)\s*(gb|mb|kb)\s*ram/i },
    { key: "ram", regex: /(\d+(?:\.\d+)?)\s*(gb|mb|kb)\b(?!.*\b(storage|rom)\b)/i },
    { key: "size", regex: /size\s*(\d+(?:\.\d+)?)/i },
    { key: "size", regex: /(\d+(?:\.\d+)?)\s*(?:inch|in|cm|mm)\b/i },
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

const normalizeValue = (value = "") => normalizeWhitespace(value).replace(/\s+/g, " ");

const removeMatches = (text, patterns) =>
    patterns.reduce((result, pattern) => result.replace(pattern, " "), text).replace(/\s+/g, " ").trim();

const extractFirstMatch = (text, regex) => {
    const match = regex.exec(text);
    return match ? match[1]?.toString().trim() : null;
};

export const extractTitleAttributes = (rawTitle) => {
    const title = normalizeWhitespace(rawTitle || "");
    const lowerTitle = title.toLowerCase();

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

    const tokens = tokenize(title);
    const remainingParts = [...tokens];

    for (const color of COLOR_WORDS) {
        const index = remainingParts.indexOf(color);
        if (index !== -1) {
            result.color = result.color || color.charAt(0).toUpperCase() + color.slice(1);
            remainingParts.splice(index, 1);
        }
    }

    for (const pattern of UNIT_PATTERNS) {
        const match = extractFirstMatch(title, pattern.regex);
        if (match) {
            const value = match.toUpperCase().replace(/\s+/g, "");
            if (pattern.key === "size") {
                result.screenSize = result.screenSize || value;
                result.size = result.size || value;
            } else if (pattern.key === "storage") {
                result.storage = result.storage || value;
            } else if (pattern.key === "ram") {
                result.ram = result.ram || value;
            } else if (pattern.key === "weight") {
                result.weight = result.weight || value;
            } else if (pattern.key === "packSize") {
                result.packSize = result.packSize || value;
            } else if (pattern.key === "quantity") {
                result.quantity = result.quantity || value;
            }
        }
    }

    for (const processorPattern of PROCESSOR_PATTERNS) {
        const match = processorPattern.exec(title);
        if (match) {
            result.processor = match[0].replace(/\s+/g, " ");
            break;
        }
    }

    const cleanedTitle = tokens.join(" ");
    const colorRegex = new RegExp(`\\b(?:${COLOR_WORDS.join("|")})\\b`, "gi");
    const noVariants = removeMatches(cleanedTitle, [
        colorRegex,
        /\bsize\s*\d+(?:\.\d+)?\b/gi,
        /\b\d+(?:\.\d+)?\s*(?:inch|in|cm|mm)\b/gi,
        /\b\d+(?:\.\d+)?\s*(?:tb|gb|mb|kb)\b/gi,
        /\b\d+\s*(?:ram)\b/gi,
        /\bpack(?:\s*of)?\s*\d+\b/gi,
        /\b\d+\s*(?:pcs|pieces|units|count)\b/gi,
    ]);

    const finalTokens = tokenize(noVariants).filter((token) => token !== "of" && token !== "with");
    const canonicalTitle = finalTokens.map((token, index) =>
        index === 0 ? token.charAt(0).toUpperCase() + token.slice(1) : token
    ).join(" ");

    if (finalTokens.length > 0) {
        const firstToken = finalTokens[0];
        if (!/^(\d+|pack|set|bundle|box|combo)$/i.test(firstToken)) {
            result.brand = firstToken.charAt(0).toUpperCase() + firstToken.slice(1);
        }
    }

    if (finalTokens.length > 1) {
        result.model = finalTokens.slice(1).join(" ");
    }

    return {
        normalizedTitle: normalizeWhitespace(canonicalTitle),
        canonicalTitle: normalizeWhitespace(canonicalTitle),
        canonicalKey: slugify(canonicalTitle),
        attributes: result,
        tokens: finalTokens,
    };
};
