/**
 * Amazon India search-results page selectors.
 *
 * Each key is an ordered list of CSS selectors tried top-to-bottom.
 * More specific / reliable selectors come first; broader fallbacks last.
 * This multi-selector approach survives Amazon's periodic DOM changes.
 */
export const AMAZON_SELECTORS = {

    // ── Product card container ────────────────────────────────────────────
    // data-asin is the stable identifier; we only want real listing cards,
    // not sponsored carousels or "customers also bought" widgets.
    product: [
        'div[data-component-type="s-search-result"][data-asin]:not([data-asin=""])',
        'div[data-asin]:not([data-asin=""])[data-index]',
    ],

    // ── Product title ─────────────────────────────────────────────────────
    // Amazon wraps the title in a <span> inside an <h2>; multiple class
    // variants are used across A/B test buckets.
    title: [
        'h2.a-size-medium.a-color-base.a-text-normal span',
        'h2.a-size-base-plus.a-color-base.a-text-normal span',
        'h2[class*="a-size-"] span.a-text-normal',
        'h2 a span',
        'a.a-link-normal h2 span',
        'a.s-link-style h2 span',
        '.s-title-instructions-style h2 span',
        'h2 span.a-size-medium',
    ],

    // ── Price ─────────────────────────────────────────────────────────────
    // .a-offscreen holds the screen-reader / accessible price text which is
    // always numeric (e.g. "₹1,24,999") — far more reliable than the
    // visually split whole/fraction display.
    price: [
        '.a-price .a-offscreen',
        'span[data-a-color="price"] .a-offscreen',
        '.a-price-whole',             // fallback: integer part only
        '.a-color-price',
    ],

    // ── Product image ──────────────────────────────────────────────────────
    // s-image is Amazon's dedicated search-result image class.
    image: [
        'div[data-cy="image-container"] img.s-image',
        '.s-product-image-container img.s-image',
        'img.s-image',
        '.a-dynamic-image.s-image',
    ],

    // ── Star rating ────────────────────────────────────────────────────────
    // .a-icon-alt contains the full accessible text e.g. "4.3 out of 5 stars"
    rating: [
        '.a-icon-star-small .a-icon-alt',
        '.a-icon-star .a-icon-alt',
        'span[aria-label*="out of 5 stars"]',
        '.a-icon-alt',
    ],

    // ── Product link ──────────────────────────────────────────────────────
    // We prefer the title-anchor which always points to the product detail page.
    link: [
        'h2 a.a-link-normal',
        'a.a-link-normal.s-no-outline',
        'a.a-link-normal[href*="/dp/"]',
        'a.a-link-normal',
        'h2 a',
    ],

    // ── Review count (bonus — used by normalizer if present) ──────────────
    reviewCount: [
        'span[aria-label*="ratings"] .a-size-base',
        '.a-size-base.s-underline-text',
    ],
};
