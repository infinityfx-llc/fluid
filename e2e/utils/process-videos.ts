import fs from 'fs';
import path from 'path';
import { execFile, spawn } from 'child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const ffmpegPath = ffmpegInstaller.path;

// Hardcoded Configuration Constants
const CROSSFADE_DURATION = 0.5; // Seconds for crossfade into outro
const AUDIO_VOLUME = 1.0;       // Background music volume level
const AUDIO_FADE_OUT = 1.0;      // Seconds of audio fade out at the end
const DEFAULT_AUDIO_START = 'auto'; // 'auto' to detect beat drop/onset, or a number (e.g. 4.5 or 0)
const TARGET_FPS = 60;
const OUTRO_FILENAME = 'logo-demo.mp4';

// Parse optional CLI arguments: --video=button --music=track.mp3 --audio-start=auto (or 4.5)
const argsMap = new Map<string, string>();
for (const arg of process.argv.slice(2)) {
	if (arg.startsWith('--')) {
		const [key, val] = arg.slice(2).split('=');
		if (key) argsMap.set(key.toLowerCase(), val || 'true');
	}
}

const AUDIO_START_ARG = argsMap.get('audio-start') ?? DEFAULT_AUDIO_START;
const TARGET_VIDEO_ARG = argsMap.get('video');

const RAW_DIR = path.resolve('videos', 'raw');
const OUTPUT_DIR = path.resolve('videos');
const MUSIC_DIR = path.resolve('music');

function probeDuration(filePath: string): Promise<number> {
	return new Promise((resolve, reject) => {
		execFile(ffmpegPath, ['-i', filePath], (error, stdout, stderr) => {
			const output = (stderr || '') + (stdout || '');
			const match = output.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);

			if (match) {
				const hours = parseFloat(match[1]);
				const minutes = parseFloat(match[2]);
				const seconds = parseFloat(match[3]);
				const duration = hours * 3600 + minutes * 60 + seconds;
				resolve(duration);
			} else {
				reject(new Error(`Could not parse duration for ${filePath}`));
			}
		});
	});
}

function getMusicFiles(): string[] {
	if (!fs.existsSync(MUSIC_DIR)) return [];

	const audioExtensions = new Set(['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac']);
	const files = fs.readdirSync(MUSIC_DIR);
	const results: string[] = [];

	for (const file of files) {
		const ext = path.extname(file).toLowerCase();
		if (audioExtensions.has(ext)) {
			results.push(path.join(MUSIC_DIR, file));
		}
	}

	return results;
}

function selectMusicFile(availableFiles: string[]): string | null {
	const customMusic = argsMap.get('music');
	if (customMusic && customMusic !== 'random') {
		const customPath = path.resolve(customMusic);
		if (fs.existsSync(customPath)) return customPath;
		const inMusicDir = path.join(MUSIC_DIR, customMusic);
		if (fs.existsSync(inMusicDir)) return inMusicDir;
		console.warn(`Warning: Specified music file '${customMusic}' not found.`);
	}

	if (availableFiles.length === 0) return null;
	if (availableFiles.length === 1) return availableFiles[0];

	// Randomly pick from available audio files
	const randomIndex = Math.floor(Math.random() * availableFiles.length);
	return availableFiles[randomIndex];
}

interface BeatDetectionResult {
	type: 'drop' | 'beat' | 'start';
	time: number;
	details: string;
}

async function detectAudioStart(audioPath: string): Promise<BeatDetectionResult> {
	const step = 0.25;
	const maxScan = 45;
	const promises: Promise<{ t: number; mean: number; max: number }>[] = [];

	for (let t = 0; t < maxScan; t += step) {
		promises.push(
			new Promise((resolve) => {
				execFile(
					ffmpegPath,
					['-ss', String(t), '-t', String(step), '-i', audioPath, '-filter:a', 'volumedetect', '-f', 'null', '-'],
					(err, stdout, stderr) => {
						const output = stderr || '';
						const mean = parseFloat((output.match(/mean_volume: ([-.\d]+) dB/) || [])[1] || '-99');
						const max = parseFloat((output.match(/max_volume: ([-.\d]+) dB/) || [])[1] || '-99');
						resolve({ t, mean, max });
					}
				);
			})
		);
	}

	const slices = await Promise.all(promises);
	slices.sort((a, b) => a.t - b.t);

	// 1. Look for a beat drop / major energy surge (> 5 dB jump and hitting high peak >= -4 dB)
	let maxSurge = -99;
	let bestDropTime = -1;

	for (let i = 1; i < slices.length; i++) {
		const surge = slices[i].mean - slices[i - 1].mean;
		if (surge > 5.0 && slices[i].max >= -4.0 && surge > maxSurge) {
			maxSurge = surge;
			bestDropTime = slices[i].t;
		}
	}

	if (bestDropTime >= 0) {
		return {
			type: 'drop',
			time: bestDropTime,
			details: `Beat drop detected at ${bestDropTime.toFixed(2)}s (+${maxSurge.toFixed(1)} dB surge)`
		};
	}

	// 2. If no dramatic drop, look for the first clear rhythmic beat onset
	const firstBeat = slices.find((s) => s.max >= -3.0 && s.mean >= -25.0);
	if (firstBeat && firstBeat.t > 0) {
		return {
			type: 'beat',
			time: firstBeat.t,
			details: `First strong beat detected at ${firstBeat.t.toFixed(2)}s (${firstBeat.max.toFixed(1)} dB peak)`
		};
	}

	// 3. Fallback to start
	return {
		type: 'start',
		time: 0.0,
		details: 'No drop or distinct beat found in first 30s; starting from 0.0s'
	};
}

async function processVideo(
	rawVideoPath: string,
	outroVideoPath: string,
	audioPath: string | null,
	audioStartOffset: number,
	outroDuration: number
) {
	const filename = path.basename(rawVideoPath);
	const targetPath = path.join(OUTPUT_DIR, filename);

	const mainDuration = await probeDuration(rawVideoPath);
	const fadeDuration = Math.min(CROSSFADE_DURATION, mainDuration / 2);
	const offset = Math.max(0, mainDuration - fadeDuration);
	const totalDuration = offset + outroDuration;
	const audioFadeOutStart = Math.max(0, totalDuration - AUDIO_FADE_OUT);

	console.log(`\nProcessing: ${filename}`);

	const args = [
		'-y',
		'-i', rawVideoPath,
		'-i', outroVideoPath
	];

	const videoFilter = [
		`[0:v]tpad=stop_mode=clone:stop_duration=${outroDuration.toFixed(3)},format=yuva420p[v0]`,
		`[1:v]format=yuva420p,fade=t=in:st=0:d=${fadeDuration.toFixed(3)}:alpha=1,setpts=PTS-STARTPTS+${offset.toFixed(3)}/TB[v1]`,
		`[v0][v1]overlay=shortest=1:format=auto[v]`
	].join(';');

	if (audioPath) {
		console.log(`  - Audio: ${path.basename(audioPath)}`);
		if (audioStartOffset > 0) {
			args.push('-ss', String(audioStartOffset));
		}
		args.push('-i', audioPath);

		const audioFilter = `[2:a]aloop=loop=-1:size=2e+09,atrim=0:${totalDuration.toFixed(3)},afade=t=out:st=${audioFadeOutStart.toFixed(3)}:d=${AUDIO_FADE_OUT.toFixed(3)},volume=${AUDIO_VOLUME}[a]`;

		args.push(
			'-filter_complex', `${videoFilter};${audioFilter}`,
			'-map', '[v]',
			'-map', '[a]',
			'-c:v', 'libx264',
			'-pix_fmt', 'yuv420p',
			'-r', String(TARGET_FPS),
			'-c:a', 'aac',
			'-b:a', '192k',
			'-shortest',
			targetPath
		);
	} else {
		console.log('  - No audio file found; rendering video only.');

		args.push(
			'-filter_complex', videoFilter,
			'-map', '[v]',
			'-c:v', 'libx264',
			'-pix_fmt', 'yuv420p',
			'-r', String(TARGET_FPS),
			targetPath
		);
	}

	await new Promise<void>((resolve, reject) => {
		const proc = spawn(ffmpegPath, args);
		let stderr = '';

		proc.stderr.on('data', (chunk) => {
			stderr += chunk.toString();
		});

		proc.on('error', reject);
		proc.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`FFmpeg exited with code ${code}\n${stderr}`));
			}
		});
	});

	console.log(`  ✓ Saved to ${path.relative(process.cwd(), targetPath)}`);
}

async function main() {
	if (!fs.existsSync(RAW_DIR)) {
		console.error(`Error: Raw videos directory not found at ${RAW_DIR}`);
		process.exit(1);
	}

	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	const outroVideoPath = path.join(RAW_DIR, OUTRO_FILENAME);
	if (!fs.existsSync(outroVideoPath)) {
		console.error(`Error: Outro video '${OUTRO_FILENAME}' not found in ${RAW_DIR}.`);
		console.error(`Please run the logo demo test first to record the outro:`);
		console.error(`  npx playwright test e2e/demos/logo.test.ts --project="videos"`);
		process.exit(1);
	}

	const outroDuration = await probeDuration(outroVideoPath);
	const availableMusic = getMusicFiles();
	const customMusicArg = argsMap.get('music');
	const audioOffsetsCache = new Map<string, number>();

	async function getOffsetForTrack(trackPath: string): Promise<number> {
		if (audioOffsetsCache.has(trackPath)) {
			return audioOffsetsCache.get(trackPath)!;
		}

		let offset = 0;
		if (AUDIO_START_ARG === 'auto') {
			console.log(`Analyzing '${path.basename(trackPath)}' for beat drop / onset...`);
			const detection = await detectAudioStart(trackPath);
			console.log(`  ✓ ${detection.details}`);
			offset = detection.time;
		} else {
			offset = parseFloat(AUDIO_START_ARG) || 0;
			console.log(`Using manual audio start offset for '${path.basename(trackPath)}': ${offset.toFixed(2)}s`);
		}

		audioOffsetsCache.set(trackPath, offset);
		return offset;
	}

	// If explicit --music was provided, resolve it
	let explicitMusicFile: string | null = null;
	let explicitAudioOffset = 0;

	if (customMusicArg) {
		explicitMusicFile = selectMusicFile(availableMusic);
		if (explicitMusicFile) {
			explicitAudioOffset = await getOffsetForTrack(explicitMusicFile);
		}
	}

	let rawFiles = fs.readdirSync(RAW_DIR).filter((file) => {
		return file.endsWith('.mp4') && file !== OUTRO_FILENAME;
	});

	// Handle --video=<name> to process a single video
	if (TARGET_VIDEO_ARG) {
		const cleanTarget = path.basename(TARGET_VIDEO_ARG).replace(/\.mp4$/i, '').toLowerCase();
		rawFiles = rawFiles.filter((file) => {
			const cleanFile = file.replace(/\.mp4$/i, '').toLowerCase();
			return cleanFile === cleanTarget || cleanFile === `${cleanTarget}-demo` || cleanFile.startsWith(cleanTarget);
		});

		if (rawFiles.length === 0) {
			console.error(`Error: No raw video matching '${TARGET_VIDEO_ARG}' found in ${RAW_DIR}.`);
			const available = fs.readdirSync(RAW_DIR).filter((f) => f.endsWith('.mp4') && f !== OUTRO_FILENAME);
			console.error(`Available raw videos: ${available.join(', ')}`);
			process.exit(1);
		}
	}

	if (rawFiles.length === 0) {
		console.log(`No demo videos to process in ${RAW_DIR} (excluding ${OUTRO_FILENAME}).`);
		return;
	}

	console.log(`\n========================================`);
	console.log(`Video Post-Processing`);
	console.log(`- Outro: ${OUTRO_FILENAME}`);
	if (explicitMusicFile) {
		console.log(`- Music: ${path.basename(explicitMusicFile)}`);
	} else if (availableMusic.length > 0) {
		console.log(`- Music: Random per video (${availableMusic.length} track${availableMusic.length > 1 ? 's' : ''})`);
	}
	console.log(`- Videos to process: ${rawFiles.length}`);
	console.log(`========================================`);

	for (const file of rawFiles) {
		const rawPath = path.join(RAW_DIR, file);
		try {
			let currentMusic = explicitMusicFile;
			let currentOffset = explicitAudioOffset;

			if (!explicitMusicFile && availableMusic.length > 0) {
				currentMusic = selectMusicFile(availableMusic);
				if (currentMusic) {
					currentOffset = await getOffsetForTrack(currentMusic);
				}
			}

			await processVideo(rawPath, outroVideoPath, currentMusic, currentOffset, outroDuration);
		} catch (err) {
			console.error(`Failed to process ${file}:`, err);
		}
	}

	console.log(`\nAll videos processed successfully!`);
}

main().catch((err) => {
	console.error('Unexpected error during video post-processing:', err);
	process.exit(1);
});
