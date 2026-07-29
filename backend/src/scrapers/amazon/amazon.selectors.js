export const AMAZON_SELECTORS = {

    product: [
        'div[data-component-type="s-search-result"][data-asin]:not([data-asin=""])',
        'div[data-asin]:not([data-asin=""])[data-index]',
    ],

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

    price: [
        '.a-price .a-offscreen',
        'span[data-a-color="price"] .a-offscreen',
        '.a-price-whole',
        '.a-color-price',
    ],

    image: [
        'div[data-cy="image-container"] img.s-image',
        '.s-product-image-container img.s-image',
        'img.s-image',
        '.a-dynamic-image.s-image',
    ],

    rating: [
        '.a-icon-star-small .a-icon-alt',
        '.a-icon-star .a-icon-alt',
        'span[aria-label*="out of 5 stars"]',
        '.a-icon-alt',
    ],

    link: [
        'h2 a.a-link-normal',
        'a.a-link-normal.s-no-outline',
        'a.a-link-normal[href*="/dp/"]',
        'a.a-link-normal',
        'h2 a',
    ],

};
