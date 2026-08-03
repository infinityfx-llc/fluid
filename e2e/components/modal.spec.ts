import { test, expect } from '@playwright/test';

test.describe('Component Showcase - Fast Functional E2E', () => {
  test('renders showcase page and handles interactions', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Verify header title
    await expect(page.getByText('Component Showcase')).toBeVisible();

    // Verify counter button interaction
    const button = page.locator('#showcase-counter-btn');
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toContainText('Tap Counter: 1');
  });
});
