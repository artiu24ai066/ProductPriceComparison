export const normalizeWhitespace = (value = "") =>
    value
        .toString()
        .replace(/\s+/g, " ")
        .trim();

export const slugify = (value = "") =>
    normalizeWhitespace(value)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export const parseNumber = (value) => {
    if (value == null || value === "") return null;
    const cleaned = value.toString().replace(/[^0-9.\-]+/g, "").trim();
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
};

export const tokenize = (value = "") =>
    normalizeWhitespace(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(" ")
        .filter((token) => token && token.length > 1);

export const compactObject = (obj) => {
    if (Array.isArray(obj)) {
        return obj.filter((value) => value !== undefined && value !== null && value !== "");
    }
    return Object.entries(obj || {}).reduce((result, [key, value]) => {
        if (value === undefined || value === null || value === "") return result;
        if (Array.isArray(value) && value.length === 0) return result;
        result[key] = value;
        return result;
    }, {});
};

export const uniqueValues = (values = []) => [...new Set(values.filter((value) => value !== undefined && value !== null))];
