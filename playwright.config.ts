import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	retries: 0,
	workers: 4,
	reporter: [
		['html'],
		['./e2e/helpers/video-reporter.ts']
	],

	projects: [
		{
			name: 'e2e',
			testIgnore: /.*\.demo\.ts/,
			outputDir: './test-results',
			use: {
				...devices['Desktop Chrome'],
				video: 'off',
			},
		},
		{
			name: 'videos',
			testMatch: /.*\.demo\.ts/,
			outputDir: './videos',
			use: {
				viewport: { width: 1080, height: 1920 },
				isMobile: true,
				hasTouch: true,
				video: {
					mode: 'on',
					size: { width: 1080, height: 1920 },
				},
				launchOptions: {
					slowMo: 500,
				}
			}
		}
	],

	webServer: {
		command: 'npx vite e2e/demo --port 5173',
		url: 'http://localhost:5173',
		reuseExistingServer: true
	},
});
