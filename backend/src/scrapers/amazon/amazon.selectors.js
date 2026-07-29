export const AMAZON_SELECTORS = {

    // ── Product card container ────────────────────────────────────────────
    // data-asin filters out empty placeholder slots and ad widgets
    product: [
        'div[data-component-type="s-search-result"][data-asin]:not([data-asin=""])',
        'div[data-asin]:not([data-asin=""])[data-index]',
    ],

    // ── Product title ─────────────────────────────────────────────────────
    title: [
        'h2.a-size-medium.a-color-base.a-text-normal span',
        'h2.a-size-base-plus.a-color-base.a-text-normal span',
        'h2[class*="a-size-"] span.a-text-normal',
        'h2 a span',
        'h2 span',
    ],

    // ── Price ─────────────────────────────────────────────────────────────
    // .a-offscreen has the clean numeric price e.g. "₹1,24,999"
    price: [
        '.a-price .a-offscreen',
        'span[data-a-color="price"] .a-offscreen',
        '.a-price-whole',
        '.a-color-price',
    ],

    // ── Product image ─────────────────────────────────────────────────────
    image: [
        'div[data-cy="image-container"] img.s-image',
        '.s-product-image-container img.s-image',
        'img.s-image',
    ],

    // ── Star rating ────────────────────────────────────────────────────────
    // .a-icon-alt has text like "4.3 out of 5 stars"
    rating: [
        '.a-icon-star-small .a-icon-alt',
        '.a-icon-star .a-icon-alt',
        'span[aria-label*="out of 5 stars"]',
        '.a-icon-alt',
    ],

    // ── Product link ──────────────────────────────────────────────────────
    link: [
        'h2 a.a-link-normal',
        'a.a-link-normal.s-no-outline',
        'a.a-link-normal[href*="/dp/"]',
        'a.a-link-normal',
        'h2 a',
    ],

};
