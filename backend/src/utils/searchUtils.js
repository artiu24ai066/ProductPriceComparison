export const normalizeQuery = (query = "") =>
    query.toString().trim().toLowerCase().replace(/\s+/g, " ");
