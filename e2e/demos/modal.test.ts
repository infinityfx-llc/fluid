import { test } from '../helpers/video-recorder';
import { injectCursorOverlay } from '../helpers/cursor-overlay';

test.describe('Modals', () => {
  test.beforeEach(async ({ page }) => {
    await injectCursorOverlay(page);

    await page.goto('/modal');
    await page.waitForTimeout(600);
  });

  test('Modal demo', async ({ page }) => {
    const frame = page.frameLocator('iframe');

    const openBtn = frame.getByRole('button', { name: 'open' });
    await openBtn.click();
    await page.waitForTimeout(800);

    const field = frame.getByLabel('first name');
    field.click();
    await page.waitForTimeout(300);
    page.keyboard.type('John', { delay: 100 });
    await page.waitForTimeout(1000);

    const confirmBtn = frame.getByRole('button', { name: 'confirm' });
    await confirmBtn.click();
    await page.waitForTimeout(1000);
  });
});
