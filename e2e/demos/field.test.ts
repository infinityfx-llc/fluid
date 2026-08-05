import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Fields', () => {
  test.beforeEach(setupDemoTest('/field'));

  test('Field demo', async ({ page }) => {
    const { delay, typeByLabel } = getUtilities(page);
    await delay(1000);

    const field = await typeByLabel('username', 'john_doe');
    await field.blur();

    await delay(1000);
  });
});
