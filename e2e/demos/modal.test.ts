import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Modals', () => {
  test.beforeEach(setupDemoTest('/modal'));

  test('Modal demo', async ({ page }) => {
    const { delay, click, typeByLabel } = getUtilities(page);
    await delay(1000);

    await click('button', 'open');
    await typeByLabel('first name', 'John');
    await click('button', 'confirm');

    await delay(1000);
  });
});
