import { test } from '../utils/video-recorder';
import { injectCursorOverlay } from '../utils/cursor-overlay';

test.describe('Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await injectCursorOverlay(page);

    await page.goto('/button');
  });

  test('Button demo', async ({ page }) => {
    await page.waitForTimeout(1600);

    const frame = page.frameLocator('iframe');

    let btn;

    for (const name of ['default', 'inverted', 'muted', 'minimal']) {
      btn = frame.getByRole('button', { name });
      await btn.click({ delay: 80 });
      await page.waitForTimeout(800);
    }

    await page.waitForTimeout(800);
  });
});
