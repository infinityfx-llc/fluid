import { test as baseTest } from '@playwright/test';
import { spawn } from 'child_process';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';

export const test = baseTest.extend({
	page: async ({ page }, use, testInfo) => {
		// Only run video recording if we are in the 'videos' project
		if (testInfo.project.name !== 'videos') {
			await use(page);
			return;
		}

		// Ensure output directory exists
		const outputDir = path.resolve('videos');
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Clean the test title to generate a valid filename
		const cleanName = testInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
		const targetPath = path.join(outputDir, `${cleanName}.mp4`);

		// Spawn FFmpeg to read raw mjpeg frames from stdin pipe
		const ffmpegProcess = spawn(ffmpegPath.path, [
			'-y', // Overwrite output files
			'-f', 'image2pipe', // Read images from pipe
			'-vcodec', 'mjpeg', // Input format is JPEG
			'-r', '30', // Input framerate
			'-i', '-', // Input from stdin
			'-c:v', 'libx264', // Encode with H.264
			'-pix_fmt', 'yuv420p', // Pixel format for maximum player compatibility
			targetPath // Output file
		]);

		ffmpegProcess.on('error', (err) => console.error('FFmpeg error:', err));

		let startTime = -1;
		let framesWritten = 0;
		let lastBuffer: Buffer | null = null;

		// Use Playwright's official page.screencast API
		await page.screencast.start({
			quality: 100,
			size: {
				width: 1080,
				height: 1920
			},
			onFrame: ({ data, timestamp }) => {
				const timeInSeconds = timestamp / 1000;

				if (startTime === -1) {
					startTime = timeInSeconds;
					lastBuffer = data;
				}

				// Calculate how many total 30fps frames SHOULD exist by this timestamp
				const elapsedTime = timeInSeconds - startTime;
				const targetFrames = Math.round(elapsedTime * 30);

				// Fill static time gaps with the previous frame to achieve Constant Frame Rate (30fps)
				while (framesWritten < targetFrames) {
					if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed && lastBuffer) {
						ffmpegProcess.stdin.write(lastBuffer);
					}
					framesWritten++;
				}

				lastBuffer = data;
			}
		});

		// Run test
		await use(page);

		// Stop screencast
		await page.screencast.stop();

		// Calculate total elapsed time at the end of the test to capture static pauses (e.g. page.waitForTimeout at end)
		const endTimeInSeconds = Date.now() / 1000;
		if (startTime !== -1 && lastBuffer) {
			const finalElapsedTime = endTimeInSeconds - startTime;
			const finalTargetFrames = Math.round(finalElapsedTime * 30);

			// Pad the remaining static time all the way to the end of the test
			while (framesWritten < finalTargetFrames) {
				if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
					ffmpegProcess.stdin.write(lastBuffer);
				}
				framesWritten++;
			}
		}

		// Flush final frame & send EOF to FFmpeg
		if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
			ffmpegProcess.stdin.end();
		}

		// Wait for FFmpeg to finish encoding MP4
		await new Promise<void>((resolve) => {
			ffmpegProcess.on('close', () => resolve());
		});
	}
});

export { expect } from '@playwright/test';
