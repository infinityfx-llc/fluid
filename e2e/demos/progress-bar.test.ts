import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Progress bar', () => {
    test.beforeEach(setupDemoTest('/progress-bar'));

    test('Progress bar demo', async ({ page }) => {
        const { delay, click } = getUtilities(page);
        await delay(1000);

        await click('button');
        await click('button');
        await click('button');
        
        await delay(1000);
    });
});
