import { test as baseTest } from '@playwright/test';
import { spawn } from 'child_process';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';

const TARGET_FPS = 60;

export const test = baseTest.extend({
	page: async ({ page }, use, { title }) => {
		const outputDir = path.resolve('videos');
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

		if (!fs.existsSync(targetPath)) return;

		const tempPath = targetPath.replace(/\.mp4$/, '-raw.mp4');

		try {
			fs.renameSync(targetPath, tempPath);

			await new Promise<void>((resolve) => {
				// Transition duration synchronized for both zoom & color fade (0.25s = 15 frames at 60fps)
				const TRANSITION_SEC = 0.25;
				const D = Math.round(TRANSITION_SEC * TARGET_FPS); // 15 frames

				// Calculate exact total frames (demoload excluded initial page loading)
				const actualTotalFrames = Math.max(D * 2, framesWritten);
				const endStart = Math.max(D + 1, actualTotalFrames - D);

				// Double-precision floating point (.0) zoompan evaluation for smooth subpixel motion at 1080x1920
				const zoomFilter = `zoompan=z=if(lte(on\\,${D})\\,1.18-0.18*(1-(1-on/${D}.0)*(1-on/${D}.0)*(1-on/${D}.0)*(1-on/${D}.0)*(1-on/${D}.0))\\,if(gte(on\\,${endStart})\\,1.0+0.18*((on-${endStart})/${D}.0)*((on-${endStart})/${D}.0)*((on-${endStart})/${D}.0)*((on-${endStart})/${D}.0)*((on-${endStart})/${D}.0)\\,1.0)):x=(iw/2.0)-(iw/zoom/2.0):y=(ih/2.0)-(ih/zoom/2.0):d=1:s=1080x1920:fps=60`;

				// Synchronized 0.25s color fade in (start) and fade out (end) to #f7f6f5
				const fadeOutStartSec = Math.max(TRANSITION_SEC, (actualTotalFrames - D) / TARGET_FPS).toFixed(2);
				const fadeInFilter = `fade=t=in:st=0:d=${TRANSITION_SEC}:color=0xf7f6f5`;
				const fadeOutFilter = `fade=t=out:st=${fadeOutStartSec}:d=${TRANSITION_SEC}:color=0xf7f6f5`;

				const postProcess = spawn(ffmpegPath.path, [
					'-y',
					'-i', tempPath,
					'-vf', `${zoomFilter},${fadeInFilter},${fadeOutFilter}`,
					'-c:v', 'libx264',
					'-pix_fmt', 'yuv420p',
					targetPath
				]);

				postProcess.on('error', resolve);
				postProcess.on('close', resolve);
			});

			if (fs.existsSync(tempPath) && !fs.existsSync(targetPath)) {
				fs.renameSync(tempPath, targetPath);
			} else if (fs.existsSync(tempPath)) {
				fs.unlinkSync(tempPath);
			}
		} catch { }
	}
});

export { expect } from '@playwright/test';
