import { Page } from "@playwright/test";
import { injectCursorOverlay } from "./cursor-overlay";

export function setupDemoTest(route: string) {
    return async ({ page }: {
        page: Page;
    }) => {
        // await injectCursorOverlay(page);

        const loaded = page.waitForEvent('console', msg => msg.text() === 'demoload');
        await page.goto(route);
        await loaded;
    }
}

export function getUtilities(page: Page) {
    const frame = page.frameLocator('iframe');

    return {
        async typeByLabel(label: string, content: string) {
            const field = frame.getByLabel(label);
            await field.click({ delay: 80 });

            await page.waitForTimeout(500);

            await page.keyboard.type(content, { delay: 100 });

            await page.waitForTimeout(1000);

            return field;
        },
        async click(name: string, {
            delay = 1000,
            element = 'button'
        }: {
            delay?: number;
            element?: 'button' | 'checkbox' | 'switch';
        } = {}) {
            const button = frame.getByRole(element, { name });
            await button.click({ delay: 80 });
            await page.waitForTimeout(delay);
        },
        async delay(amount: number) {
            await page.waitForTimeout(amount);
        }
    };
}