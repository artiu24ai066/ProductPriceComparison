export const removeInvalidProducts = (products) => {
    return (products || []).filter((product) => {
        const hasTitle = typeof product?.title === "string" && product.title.trim().length > 0;
        const hasPrice = product?.price !== undefined && product?.price !== null;
        const hasUrlOrImage = typeof product?.url === "string" && product.url.trim().length > 0;
        return hasTitle && hasPrice && hasUrlOrImage;
    });
};
