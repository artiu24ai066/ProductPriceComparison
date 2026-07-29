/**
 * Reliance Digital search-results page selectors.
 *
 * Reliance Digital uses a React-based SPA. The class names are more stable
 * than Flipkart's but the site relies heavily on JS rendering. We target
 * BEM-style class prefixes and data attributes where possible.
 */
export const RELIANCE_SELECTORS = {

    // ── Product card container ────────────────────────────────────────────
    product: [
        ".product-card",                // primary
        ".fy__product-card",            // alternate namespace
        "div[class*='product-card']",   // any variant
        "li.product",                   // list view
        "div[class*='plp-card']",       // PLP (product listing page) card
    ],

    // ── Product title ─────────────────────────────────────────────────────
    title: [
        ".product-card-title",
        ".fy__product-title",
        "p.product-title",
        "h3.product-title",
        "p[class*='title']",
        "h3[class*='title']",
        "a[class*='title']",
        ".details-container .title",
    ],

    // ── Price ─────────────────────────────────────────────────────────────
    price: [
        ".price",
        ".fy__price",
        "span.price",
        "div[class*='price'] span",
        "span[class*='price']",
        "span[class*='final-price']",
        "span[class*='selling-price']",
        ".price-block .sp",
    ],

    // ── Product image ─────────────────────────────────────────────────────
    image: [
        ".product-card-image img",
        ".fy__img",                          // known class
        "img[class*='product-image']",
        "img[class*='fy__']",
        "div[class*='image-container'] img",
        "figure img",
        "img[loading='lazy']",               // lazy-loaded images
        "img[data-src]",                     // lazy-load attribute
        "img",
    ],

    // ── Product link ──────────────────────────────────────────────────────
    link: [
        "a.product-card-image",             // image-anchor wraps product link
        "a.details-container",
        ".product-card-title a",
        "a[href*='/p/']",
        "a[href*='/buy/']",
        "a[class*='product']",
        "a",                                // broadest fallback within card
    ],

    // ── Star rating ────────────────────────────────────────────────────────
    rating: [
        ".rating",
        ".fy__rating",
        "span[class*='rating']",
        "div[class*='rating']",
        "span.rating-number",
        "div.rating-count",
    ],

    // ── Review count (bonus) ──────────────────────────────────────────────
    reviewCount: [
        ".review-count",
        "span[class*='review']",
        "span[class*='count']",
    ],
};
