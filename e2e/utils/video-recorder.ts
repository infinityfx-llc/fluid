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

		const TARGET_FPS = 60;

		// Spawn FFmpeg to read raw mjpeg frames from stdin pipe
		const ffmpegProcess = spawn(ffmpegPath.path, [
			'-y', // Overwrite output files
			'-f', 'image2pipe', // Read images from pipe
			'-vcodec', 'mjpeg', // Input format is JPEG
			'-framerate', String(TARGET_FPS), // Set input pipe framerate matching TARGET_FPS
			'-i', '-', // Input from stdin
			'-r', String(TARGET_FPS), // Output framerate (60fps CFR)
			'-c:v', 'libx264', // Encode with H.264
			'-pix_fmt', 'yuv420p', // Pixel format for maximum player compatibility
			targetPath // Output file
		]);

		ffmpegProcess.on('error', (err) => console.error('FFmpeg error:', err));

		let startTime = -1;
		let startWallClock = -1;
		let framesWritten = 0;
		let lastBuffer: Buffer | null = null;
		let demoloadReceived = false;

		// Reset recording clock when React main.tsx logs 'demoload'
		page.on('console', (msg) => {
			if (msg.text() === 'demoload') {
				startTime = -1;
				startWallClock = -1;
				framesWritten = 0;
				lastBuffer = null;
				demoloadReceived = true;
			}
		});

		// Use Playwright's official page.screencast API
		await page.screencast.start({
			quality: 90,
			size: {
				width: 1080,
				height: 1920
			},
			onFrame: ({ data, timestamp }) => {
				// Ignore pre-render frames until the current page fires 'demoload'
				if (!demoloadReceived) return;

				const timeInSeconds = timestamp / 1000;

				if (startTime === -1) {
					startTime = timeInSeconds;
					startWallClock = Date.now() / 1000; // Capture matching wall clock baseline
					lastBuffer = data;
					return;
				}

				const elapsedTime = timeInSeconds - startTime;
				const targetFrames = elapsedTime ? Math.round(elapsedTime * TARGET_FPS) : 1;

				// Output frames only when wall-clock time reaches new 30fps frame bucket(s)
				if (targetFrames > framesWritten) {
					while (framesWritten < targetFrames) {
						if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed && lastBuffer) {
							ffmpegProcess.stdin.write(lastBuffer);
						}
						framesWritten++;
					}
				}

				// Store the newest frame for the current or next frame slot
				lastBuffer = data;
			}
		});

		// Run test
		await use(page);

		// Pad any static time remaining at the end of the test using matching Date.now() wall clock
		const endWallClock = Date.now() / 1000;
		if (startWallClock !== -1 && lastBuffer) {
			const elapsedWallClock = endWallClock - startWallClock;
			const finalTargetFrames = Math.round(elapsedWallClock * TARGET_FPS);

			while (framesWritten < finalTargetFrames) {
				if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
					ffmpegProcess.stdin.write(lastBuffer);
				}
				framesWritten++;
			}
		}

		// Stop screencast
		await page.screencast.stop();

		// Flush final frame & send EOF to FFmpeg
		if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
			ffmpegProcess.stdin.end();
		}

		// Wait for raw FFmpeg encoding to complete
		await new Promise<void>((resolve) => {
			ffmpegProcess.on('close', () => resolve());
		});

		// Post-process with FFmpeg: apply smooth promo zoom & color fade transitions (page load is excluded by 'demoload')
		const tempPath = targetPath.replace(/\.mp4$/, '-raw.mp4');
		if (fs.existsSync(targetPath)) {
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

					const vfFilter = `${zoomFilter},${fadeInFilter},${fadeOutFilter}`;

					const postProcess = spawn(ffmpegPath.path, [
						'-y',
						'-i', tempPath,
						'-vf', vfFilter,
						'-c:v', 'libx264',
						'-pix_fmt', 'yuv420p',
						targetPath
					]);

					postProcess.stderr.on('data', (data) => {
						// Log FFmpeg errors if any occur
						const msg = data.toString();
						if (msg.includes('Error') || msg.includes('Invalid')) {
							console.error('FFmpeg post-process msg:', msg);
						}
					});

					postProcess.on('error', (err) => {
						console.error('Post-process error:', err);
						if (fs.existsSync(tempPath) && !fs.existsSync(targetPath)) {
							fs.renameSync(tempPath, targetPath);
						}
						resolve();
					});

					postProcess.on('close', (code) => {
						if (code !== 0 && fs.existsSync(tempPath) && !fs.existsSync(targetPath)) {
							console.error(`FFmpeg post-process exited with code ${code}`);
							fs.renameSync(tempPath, targetPath);
						} else if (fs.existsSync(tempPath)) {
							fs.unlinkSync(tempPath);
						}
						resolve();
					});
				});
			} catch (err) {
				console.error('Failed to post-process video:', err);
			}
		}
	}
});

export { expect } from '@playwright/test';
