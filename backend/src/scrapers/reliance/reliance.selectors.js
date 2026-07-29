export const RELIANCE_SELECTORS = {

    // ── Product card container ────────────────────────────────────────────
    // From live HTML: <div class="product-card">
    product: [
        ".product-card",
        "div[class*='product-card']",
        "li.product",
    ],

    // ── Product title ─────────────────────────────────────────────────────
    // From live HTML: <div class="product-card-title"> Apple iPhone 17 Pro... </div>
    title: [
        "div.product-card-title",
        ".fy__product-title",
        "p.product-title",
        "h3.product-title",
    ],

    // ── Price ─────────────────────────────────────────────────────────────
    // From live HTML: <div class="price"> ₹1,30,990.00 </div>
    // Must be scoped inside price-container to avoid matching mrp-amount
    price: [
        "div.price-container div.price",
        "div.price",
        "span[class*='final-price']",
        "span[class*='selling-price']",
    ],

    // ── Product image ─────────────────────────────────────────────────────
    // From live HTML: <img class="fy__img" src="https://cdn.jiostore.online/...">
    image: [
        "img.fy__img",
        ".product-card-image img",
        "img[class*='product-image']",
        "picture img",
    ],

    // ── Product link ──────────────────────────────────────────────────────
    // From live HTML: <a class="product-card-image" href="/product/...">
    link: [
        "a.product-card-image",
        "a.details-container",
        "a[href*='/product/']",
    ],

    // ── Star rating ────────────────────────────────────────────────────────
    // Reliance uses SVG stars only — no numeric rating text on listing cards.
    // Leaving empty array so scraper returns "" for rating (correct behaviour).
    rating: [],

};
