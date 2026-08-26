import { test as baseTest } from '@playwright/test';
import { spawn } from 'child_process';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';

const TARGET_FPS = 60;

export const test = baseTest.extend({
	page: async ({ page }, use, { title }) => {
		const outputDir = path.resolve('videos', 'raw');
		const targetPath = path.join(outputDir, `${title.toLowerCase().replace(/\s+/g, '-')}.mp4`);

		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

		const ffmpegProcess = spawn(ffmpegPath.path, [
			'-y',
			'-f', 'image2pipe',
			'-vcodec', 'mjpeg',
			'-framerate', String(TARGET_FPS),
			'-i', '-',
			'-r', String(TARGET_FPS),
			'-c:v', 'libx264',
			'-pix_fmt', 'yuv420p',
			targetPath
		]);

		let startWallClock = -1;
		let framesWritten = 0;
		let lastBuffer: Buffer | null = null;
		let recording = false;
		let timer: NodeJS.Timeout | null = null;

		const writeFrames = () => {
			if (!recording || startWallClock === -1 || !lastBuffer) return;

			const elapsedWallClock = (Date.now() / 1000) - startWallClock;
			const targetFrames = Math.round(elapsedWallClock * TARGET_FPS);

			while (framesWritten < targetFrames) {
				if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
					ffmpegProcess.stdin.write(lastBuffer);
				}

				framesWritten++;
			}
		};

		page.on('console', async (msg) => {
			if (msg.text() !== 'demoload') return;

			startWallClock = Date.now() / 1000;
			framesWritten = 0;
			recording = true;

			try {
				lastBuffer = await page.screenshot({ type: 'jpeg', quality: 90 });
			} catch { }

			if (!timer) timer = setInterval(writeFrames, 1000 / TARGET_FPS);
		});

		await page.screencast.start({
			quality: 90,
			size: {
				width: 1080,
				height: 1920
			},
			onFrame: ({ data }) => lastBuffer = data
		});

		// Run test
		await use(page);

		if (timer) {
			clearInterval(timer);
			timer = null;
		}

		writeFrames();
		await page.screencast.stop();

		if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
			ffmpegProcess.stdin.end();
		}

		await new Promise<void>((resolve) => ffmpegProcess.on('close', resolve));
	}
});

export { expect } from '@playwright/test';
