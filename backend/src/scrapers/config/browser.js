import { chromium } from "playwright";

let browser;

export const createBrowser = async () => {
    if (!browser) {
        browser = await chromium.launch({
            headless: true,
            args: [
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ],
        });
    }
    return browser;
};


export const createContext = async () => {
    const browser = await createBrowser();

    const context = await browser.newContext({
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",

        viewport: {
            width: 1366,
            height: 768,
        },

        locale: "en-IN",

        timezoneId: "Asia/Kolkata",

        colorScheme: "light",

        deviceScaleFactor: 1,

        isMobile: false,

        hasTouch: false,
    });

    // Hide Playwright automation
    await context.addInitScript(() => {
        Object.defineProperty(navigator, "webdriver", {
            get: () => undefined,
        });

        Object.defineProperty(navigator, "platform", {
            get: () => "Win32",
        });

        Object.defineProperty(navigator, "language", {
            get: () => "en-IN",
        });

        Object.defineProperty(navigator, "languages", {
            get: () => ["en-IN", "en"],
        });
    });
    return context;
};

export const closeBrowser = async () => {
    if (browser) {
        await browser.close();
        browser = null;
    }
};
