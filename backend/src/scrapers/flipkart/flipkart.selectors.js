export const FLIPKART_SELECTORS = {

    // ── Product card container ────────────────────────────────────────────
    product: [
        "div[data-id]",
        "div._1AtVbE[data-id]",
        "div._13oc-S",
    ],

    // ── Product title ─────────────────────────────────────────────────────
    // Electronics (iphone): <div class="RG5Slk">Apple iPhone 15...</div>
    // Grocery (atta):       <a class="pIpigb" title="Sugar.fit...">Sugar.fit...</a>
    title: [
        "div.RG5Slk",
        "a.pIpigb",
        "div.KzDlHZ",
        "div[class*='_4rR01T']",
        "a.atJtCj",
        "a.IRpwTa",
        "a[class*='s1Q9rs']",
    ],

    // ── Price ─────────────────────────────────────────────────────────────
    // From live HTML: <div class="hZ3P6w DeU9vF">₹56,900</div>
    price: [
        "div.hZ3P6w",
        "div.Nx9bqj",
        "div[class*='_30jeq3']",
        "div[class*='_1_WHN1']",
        "div[class*='price']",
        "span[class*='price']",
    ],

    // ── Product image ─────────────────────────────────────────────────────
    // From live HTML: <img class="UCc1lI" src="https://rukminim2...">
    image: [
        "img.UCc1lI",
        "img.MZeksS",
        "img._396cs4",
        "img._2r_T1I",
        "img[src*='rukminim']",
    ],

    // ── Star rating ────────────────────────────────────────────────────────
    // From live HTML: <div class="MKiFS6">4.6<img...></div>
    rating: [
        "div.MKiFS6",
        "div.XQDdHH",
        "div._3LWZlK",
        "span._2_R_DZ > span",
        "div[class*='rating']",
        "span[class*='rating']",
    ],

    // ── Product link ──────────────────────────────────────────────────────
    // From live HTML: <a class="k7wcnx" href="/apple-iphone-15...">
    link: [
        "a.k7wcnx",
        "a.k7mUBC",
        "a.CGtC98",
        "a.wjcEIp",
        "a[href*='/p/']",
        "a.fb4uj3",
        "a.GnxRXv",
    ],

};
