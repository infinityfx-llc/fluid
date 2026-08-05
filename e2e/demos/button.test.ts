import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Buttons', () => {
  test.beforeEach(setupDemoTest('/button'));

  test('Button demo', async ({ page }) => {
    const { delay, click } = getUtilities(page);
    await delay(1000);

    for (const name of ['default', 'inverted', 'muted', 'minimal']) await click('button', name);

    await delay(1000);
  });
});
