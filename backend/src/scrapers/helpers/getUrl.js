export const getUrl = async (linkElement, baseUrl = "") => {
    if (!linkElement) {
        return "";
    }

    const href = await linkElement.getAttribute("href");

    if (!href) {
        return "";
    }

    let url = href;

    // Amazon sponsored products
    if (href.startsWith("/sspa/click")) {
        const params = new URLSearchParams(href.split("?")[1]);
        const actualUrl = params.get("url");

        if (actualUrl) {
            url = decodeURIComponent(actualUrl);
        }
    }

    // Relative URL
    if (url.startsWith("/")) {
        url = baseUrl + url;
    }

    // Remove tracking parameters
    url = url.split("?")[0];

    return url;
};
