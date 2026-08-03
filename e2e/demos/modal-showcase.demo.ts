import { test, expect } from '@playwright/test';
import { injectCursorOverlay } from '../helpers/cursor-overlay';
import { smoothScroll } from '../helpers/smooth-scroll';

test.describe('Marketing Video - Component Showcase', () => {
  test.beforeEach(async ({ page }) => {
    // Inject animated cursor & tap indicator for video recording
    await injectCursorOverlay(page);
  });

  test('Vertical 9:16 Component Showcase', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 1. Initial pause for visual clarity
    await page.waitForTimeout(600);

    // 2. Smooth scroll down the vertical layout
    await smoothScroll(page, 220, 1000);
    await page.waitForTimeout(500);

    // 3. Tap counter button multiple times with animated touch ripples
    const button = page.locator('#showcase-counter-btn');
    if (await button.isVisible()) {
      await button.click();
      await page.waitForTimeout(600);
      await button.click();
      await page.waitForTimeout(600);
      await button.click();
      await page.waitForTimeout(800);
    }
  });
});
