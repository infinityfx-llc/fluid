import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	retries: 0,
	reporter: [
		['html']
	],
	projects: [
		{
			name: 'e2e',
			testDir: './e2e/tests',
			testMatch: /.*\.test\.ts/,
			use: {
				...devices['Desktop Chrome'],
				video: 'off',
			},
		},
		{
			name: 'videos',
			workers: 1,
			testDir: './e2e/demos',
			testMatch: /.*\.test\.ts/,
			outputDir: './videos',
			use: {
				baseURL: 'http://localhost:5173',
				viewport: { width: 1080, height: 1920 },
				isMobile: true,
				hasTouch: true,
				headless: false,
				launchOptions: {
					args: [
						'--disable-frame-rate-limit',
						'--run-all-compositor-stages-before-draw',
						'--disable-gpu-throttling'
					]
				}
			}
		}
	],
	webServer: {
		command: 'npx fluid compile -d && npx vite e2e/app --port 5173',
		url: 'http://localhost:5173',
		reuseExistingServer: true
	},
});
