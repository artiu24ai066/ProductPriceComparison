export const getImage = async (imageElement) => {
    if (!imageElement) {
        return "";
    }

    let image =
        (await imageElement.getAttribute("src")) ||
        (await imageElement.getAttribute("data-src")) ||
        (await imageElement.getAttribute("data-lazy-src")) ||
        (await imageElement.getAttribute("data-original")) ||
        "";

    // If src is empty, use the first image from srcset
    if (!image) {
        const srcset = await imageElement.getAttribute("srcset");

        if (srcset) {
            image = srcset.split(",")[0].trim().split(" ")[0];
        }
    }

    return image;
};
