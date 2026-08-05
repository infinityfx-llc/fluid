import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Tooltip', () => {
    test.beforeEach(setupDemoTest('/tooltip'));

    test('Tooltip demo', async ({ page }) => {
        const { delay, clickByLabel } = getUtilities(page);
        await delay(1000);

        await clickByLabel('bold');
        await clickByLabel('italic');
        const button = await clickByLabel('underline');

        await button.blur();
        await delay(1000);
    });
});
