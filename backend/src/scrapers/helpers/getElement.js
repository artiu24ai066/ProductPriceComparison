export const getElement = async (parent, selectors) => {
    for (const selector of selectors) {
        try {
            const locator = parent.locator(selector);

            const count = await locator.count();

            for (let i = 0; i < count; i++) {
                const element = locator.nth(i);

                if (await element.isVisible()) {
                    return element;
                }
            }
        }
        catch {
            continue;
        }
    }
    return null;
};
