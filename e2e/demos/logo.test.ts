import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Logo', () => {
    test.beforeEach(setupDemoTest('/logo'));

    test('Logo demo', async ({ page }) => {
        const { delay } = getUtilities(page);

        await delay(5000);
    });
});