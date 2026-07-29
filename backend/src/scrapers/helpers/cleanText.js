export const cleanText = (text="") => {
    return text
        .normalize("NFKC")
        .replace(/\s+/g, " ")
        .trim();

};
