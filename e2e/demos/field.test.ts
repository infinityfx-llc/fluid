import { test } from '../utils/video-recorder';
import { injectCursorOverlay } from '../utils/cursor-overlay';

test.describe('Fields', () => {
  test.beforeEach(async ({ page }) => {
    await injectCursorOverlay(page);

    await page.goto('/field');
  });

  test('Field demo', async ({ page }) => {
    await page.waitForTimeout(1200);
    
    const frame = page.frameLocator('iframe');

    const field = frame.getByLabel('username');
    field.click({ delay: 80 });
    await page.waitForTimeout(300);
    page.keyboard.type('john_doe', { delay: 100 });
    await page.waitForTimeout(800);

    field.blur();
    await page.waitForTimeout(1600);
  });
});
