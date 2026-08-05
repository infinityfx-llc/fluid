import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Color picker', () => {
    test.beforeEach(setupDemoTest('/color-picker'));

    test('Color picker demo', async ({ page }) => {
        const { delay, drag } = getUtilities(page);
        await delay(1000);

        await drag('[role="slider"]', 300, 0);
        await drag('.color-selector', -300, 250);

        await delay(1000);
    });
});
