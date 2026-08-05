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
        async click(selector: string, name: string) {
            const element = frame.locator(selector, { hasText: name });
            await element.click({ delay: 80 });
            await page.waitForTimeout(1000);
        },
        async drag(selector: string, x: number, y: number) {
            const element = frame.locator(selector);
            const box = await element.boundingBox();

            if (!box) return;

            await element.hover();
            await page.mouse.down();
            await page.mouse.move(
                box.x + box.width / 2 + x,
                box.y + box.height / 2 + y,
                { steps: Math.round(Math.sqrt(x ** 2 + y ** 2) / 5) }
            );
            await page.mouse.up();
            await page.waitForTimeout(500);
        },
        async delay(amount: number) {
            await page.waitForTimeout(amount);
        }
    };
}