import { test } from '../utils/video-recorder';
import { injectCursorOverlay } from '../utils/cursor-overlay';

test.describe('Modals', () => {
  test.beforeEach(async ({ page }) => {
    await injectCursorOverlay(page);

    await page.goto('/modal');
  });

  test('Modal demo', async ({ page }) => {
    await page.waitForTimeout(1200);
    
    const frame = page.frameLocator('iframe');

    const openBtn = frame.getByRole('button', { name: 'open' });
    await openBtn.click({ delay: 80 });
    await page.waitForTimeout(800);

    const field = frame.getByLabel('first name');
    field.click({ delay: 80 });
    await page.waitForTimeout(300);
    page.keyboard.type('John', { delay: 100 });
    await page.waitForTimeout(1000);

    const confirmBtn = frame.getByRole('button', { name: 'confirm' });
    await confirmBtn.click({ delay: 80 });
    await page.waitForTimeout(1000);
  });
});
