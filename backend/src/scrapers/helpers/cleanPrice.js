export const cleanPrice = (price="") => {

    return Number(
        price
            .replace(/[^0-9.]/g, "")
            .replace(/,/g, "")
    ) || 0;
};
