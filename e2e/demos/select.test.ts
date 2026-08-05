import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Select', () => {
    test.beforeEach(setupDemoTest('/select'));

    test('Select demo', async ({ page }) => {
        const { delay, click, typeByLabel } = getUtilities(page);
        await delay(1000);

        await click('button');
        await delay(500);
        await click('button', 'dark');

        await delay(1000);
    });
});