import { cleanText } from "../cleanText.js";

const SEPARATOR_REGEX = /[|/•:—-]+/;
const TOKEN_REGEX = /[a-z0-9]+/gi;
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "best",
  "buy",
  "for",
  "from",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const ATTRIBUTE_LABELS = [
  "color",
  "colour",
  "size",
  "capacity",
  "storage",
  "ram",
  "model",
  "variant",
  "edition",
  "type",
  "material",
  "gender",
  "pack",
  "quantity",
];

export const normalizeTitle = (title = "") => {
  const rawTitle = cleanText(title);
  if (!rawTitle) {
    return {
      rawTitle: "",
      normalizedTitle: "",
      titleParts: [],
      canonicalKey: "",
      attributes: {},
    };
  }

  const lowerTitle = rawTitle.toLowerCase();
  const titleParts = splitIntoTitleParts(lowerTitle)
    .map((part) => cleanText(part).toLowerCase())
    .filter(Boolean);

  const attributes = extractAttributes(lowerTitle, titleParts);
  const baseTitle = buildBaseTitle(titleParts, attributes);
  const normalizedTitle = buildNormalizedTitle(baseTitle, attributes);
  const canonicalKey = buildCanonicalKey(baseTitle, attributes);

  return {
    rawTitle,
    normalizedTitle,
    titleParts,
    canonicalKey,
    attributes,
  };
};

const splitIntoTitleParts = (text) => {
  const parts = text
    .split(SEPARATOR_REGEX)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 1 ? parts : [text];
};

const extractAttributes = (text, titleParts) => {
  const attributes = {};

  const colorMatch = text.match(/\b(black|blue|brown|cream|gold|gray|grey|green|khaki|maroon|navy|orange|pink|purple|red|silver|white|yellow|beige)\b/);
  if (colorMatch) attributes.color = colorMatch[1];

  const sizeMatch = text.match(/\b(?:size|sz)\s*(?:-|:)?\s*(\d+(?:\.\d+)?)/i);
  if (sizeMatch) attributes.size = sizeMatch[1];

  const capacityMatch = text.match(/\b(\d+(?:\.\d+)?\s?(?:gb|tb|mb|kb|ml|l))\b/i);
  if (capacityMatch) attributes.capacity = capacityMatch[1];

  const storageMatch = text.match(/\b(storage|memory)\s*(?:-|:)?\s*(\d+(?:\.\d+)?\s?(?:gb|tb|mb))\b/i);
  if (storageMatch) attributes.storage = storageMatch[2];

  const ramMatch = text.match(/\b(ram)\s*(?:-|:)?\s*(\d+(?:\.\d+)?\s?(?:gb|mb))\b/i);
  if (ramMatch) attributes.ram = ramMatch[2];

  const modelMatch = text.match(/\b(iphone|samsung|oneplus|mi|realme|poco|google|motorola|nokia|asus|dell|hp|lenovo|acer|sony|apple|xiaomi|oppo|vivo|boat|jbl|sony|nike|adidas|sparx|campus|bata|reebok|puma)\b/i);
  if (modelMatch) attributes.brand = modelMatch[1].toLowerCase();

  const variantMatch = text.match(/\b(plus|pro|max|ultra|lite|mini|standard|deluxe|premium|elite|basic|mid|plus|x|xs|xsm|m2|m3|m4|m5|m6)\b/i);
  if (variantMatch) attributes.variant = variantMatch[1].toLowerCase();

  const quantityMatch = text.match(/\b(\d+)\s*(?:pcs|pieces|pack|packs|units|qty|quantity)\b/i);
  if (quantityMatch) attributes.quantity = quantityMatch[1];

  const genericLabelValuePairs = extractLabelValuePairs(text);
  Object.assign(attributes, genericLabelValuePairs);

  const fallbackTokens = tokenize(text).filter((token) => !ATTRIBUTE_LABELS.includes(token));
  if (!attributes.brand && fallbackTokens[0]) attributes.brand = fallbackTokens[0];

  return attributes;
};

const extractLabelValuePairs = (text) => {
  const pairs = {};
  const pattern = /\b([a-z]+(?:\s+[a-z]+)?)\s*(?:-|:|\|)?\s*([a-z0-9.]+(?:\s+[a-z0-9.]+)*)/gi;
  const matches = text.matchAll(pattern);

  for (const match of matches) {
    const label = match[1].trim().toLowerCase();
    const value = match[2].trim().toLowerCase();

    if (!label || !value) continue;
    if (ATTRIBUTE_LABELS.includes(label) || label === "for" || label === "with") continue;
    if (value.length < 2) continue;

    pairs[label] = value;
  }

  return pairs;
};

const buildBaseTitle = (titleParts, attributes) => {
  const baseParts = [];

  titleParts.forEach((part) => {
    const cleanedPart = part.trim();
    if (!cleanedPart) return;
    if (/^(for|with|and|of|the|in|on|to|from)$/.test(cleanedPart)) return;
    if (cleanedPart.includes("color") || cleanedPart.includes("colour") || cleanedPart.includes("size") || cleanedPart.includes("capacity") || cleanedPart.includes("storage") || cleanedPart.includes("ram") || cleanedPart.includes("quantity")) return;
    baseParts.push(cleanedPart);
  });

  const base = baseParts.join(" ");
  return base.replace(/\s+/g, " ").trim();
};

const buildNormalizedTitle = (baseTitle, attributes) => {
  const orderedParts = [];

  if (baseTitle) orderedParts.push(baseTitle);

  Object.entries(attributes).forEach(([key, value]) => {
    if (!value || ["brand", "variant"].includes(key)) return;
    orderedParts.push(`${key}: ${value}`);
  });

  return orderedParts.join(" - ");
};

const buildCanonicalKey = (baseTitle, attributes) => {
  const tokens = tokenize(baseTitle);
  Object.entries(attributes).forEach(([key, value]) => {
    if (!value || ["brand", "variant"].includes(key)) return;
    tokens.push(`${key}-${value}`);
  });
  return tokens.join("-");
};

const tokenize = (text) => {
  const tokens = text
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

  return Array.from(new Set(tokens));
};
