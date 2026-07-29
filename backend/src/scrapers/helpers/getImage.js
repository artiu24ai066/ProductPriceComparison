// A real image URL starts with http/https or a relative /path
// Anything else (data: URI, blank, undefined) is a placeholder
const isRealUrl = (val) =>
    typeof val === "string" &&
    val.trim().length > 0 &&
    !val.trim().startsWith("data:");

export const getImage = async (imageElement) => {
    if (!imageElement) return "";

    // Try every attribute in priority order, skipping placeholders.
    // data-src / data-lazy-src / data-original are lazy-load attributes
    // that hold the real URL while src still has the tiny placeholder.
    const attrs = ["data-src", "data-lazy-src", "data-original", "src"];

    for (const attr of attrs) {
        try {
            const val = await imageElement.getAttribute(attr);
            if (isRealUrl(val)) return val.trim();
        } catch {
            continue;
        }
    }

    // Last resort: pick the highest-resolution candidate from srcset
    try {
        const srcset = await imageElement.getAttribute("srcset");
        if (srcset) {
            // srcset format: "url1 600w, url2 1200w, ..."
            // pick the entry with the largest width descriptor
            const candidates = srcset
                .split(",")
                .map((entry) => {
                    const parts = entry.trim().split(/\s+/);
                    const url   = parts[0];
                    const width = parseInt(parts[1]) || 0;
                    return { url, width };
                })
                .filter((c) => isRealUrl(c.url));

            if (candidates.length > 0) {
                candidates.sort((a, b) => b.width - a.width);
                return candidates[0].url.trim();
            }
        }
    } catch {
        // ignore
    }

    return "";
};
