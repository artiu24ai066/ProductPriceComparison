/**
 * Flipkart India search-results page selectors.
 *
 * Flipkart heavily obfuscates class names (e.g. "atJtCj", "hZ3P6w") and
 * rotates them on every deploy. The strategy here is to lead with stable
 * structural / attribute selectors and use known class-name variants as
 * mid-tier fallbacks, with broad tag-based selectors as last resorts.
 */
export const FLIPKART_SELECTORS = {

    // ── Product card container ────────────────────────────────────────────
    // data-id is Flipkart's stable product identifier.
    // The two layouts (grid tiles vs list rows) share this attribute.
    product: [
        "div[data-id]",
        "div._1AtVbE[data-id]",  // grid tile wrapper
        "div._13oc-S",           // list view card
    ],

    // ── Product title ─────────────────────────────────────────────────────
    // Titles sit in the <a> that wraps the product link; class names change
    // but the <a> always has a meaningful title / aria-label.
    title: [
        // Stable structural patterns
        "a[title]",                  // <a title="Product Name ...">
        "div[class*='_4rR01T']",     // common grid tile title div
        "a.atJtCj",                  // known obfuscated class
        "a.IRpwTa",                  // alternate obfuscated class
        "a[class*='s1Q9rs']",        // list view variant
        "div.KzDlHZ",                // newer layout
        "a[class$='title']",         // any anchor whose class ends with 'title'
        "div[class*='col'] a",       // broad fallback
    ],

    // ── Price ─────────────────────────────────────────────────────────────
    price: [
        // Most reliable: the div that contains "₹" text in grid tiles
        "div.hZ3P6w",
        "div.Nx9bqj",               // newer grid layout
        "div[class*='_30jeq3']",    // older grid layout
        "div[class*='_1_WHN1']",    // list row price
        "div[class*='price']",      // any price-labelled div
        "span[class*='price']",
    ],

    // ── Product image ─────────────────────────────────────────────────────
    image: [
        "img.MZeksS",               // grid tile
        "img._396cs4",              // list view / alt grid
        "img._2r_T1I",              // large-tile variant
        "img[class*='product-image']",
        "img[loading='lazy']",      // many Flipkart images use loading=lazy
        "img[src*='rukminim']",     // Flipkart CDN hostname is reliable
        "img",                      // broadest fallback within a card
    ],

    // ── Star rating ────────────────────────────────────────────────────────
    rating: [
        "div.MKiFS6",               // grid tile: "4.2 ★" text
        "div.XQDdHH",               // newer grid tile
        "div._3LWZlK",              // older layout
        "span._2_R_DZ > span",      // list view rating pill
        "div[class*='rating']",
        "span[class*='rating']",
    ],

    // ── Product link ──────────────────────────────────────────────────────
    link: [
        "a.k7mUBC",                 // primary grid tile anchor
        "a.CGtC98",                 // list view anchor
        "a.wjcEIp",                 // alternate grid tile anchor
        "a[href*='/p/']",           // all Flipkart product pages contain /p/
        "a[href*='itm']",           // item id in URL
        "a[class*='link']",
    ],

    // ── Review count (bonus) ──────────────────────────────────────────────
    reviewCount: [
        "span.Wphh3N",
        "span[class*='count']",
    ],
};
