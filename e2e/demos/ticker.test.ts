import { test } from '../utils/video-recorder';
import { getUtilities, setupDemoTest } from '../utils/commands';

test.describe('Ticker', () => {
    test.beforeEach(setupDemoTest('/ticker'));

    test('Ticker demo', async ({ page }) => {
        const { delay, clickByLabel } = getUtilities(page);
        await delay(1000);

        await clickByLabel('increment');
        await clickByLabel('increment');
        await clickByLabel('decrement');
        
        await delay(1000);
    });
});
