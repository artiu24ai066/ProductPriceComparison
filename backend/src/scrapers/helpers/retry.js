import { delay } from "./delay.js";

export const retry = async (
    callback,
    retries = 3,
    wait = 2000
) => {

    for (let attempt = 1; attempt <= retries; attempt++) {

        try {
            return await callback();
        }
        catch (error) {
            if (attempt === retries) {
                throw error;
            }
            await delay(wait);
        }
    }
};
