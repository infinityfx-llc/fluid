import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

/**
 * Custom Playwright Reporter that flattens video outputs inside ./marketing-videos/
 * and cleans up temporary test subfolders so only clean video files remain.
 */
export default class VideoReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    for (const attachment of result.attachments) {
      if (attachment.name === 'video' && attachment.path && fs.existsSync(attachment.path)) {
        const outputDir = path.resolve('videos');
        const originalFolder = path.dirname(attachment.path);

        const cleanName = `${test.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.webm`;
        const targetPath = path.join(outputDir, cleanName);

        try {
          // 1. Move video up to ./marketing-videos/<clean-name>.webm
          fs.renameSync(attachment.path, targetPath);

          // 2. Remove temporary test subfolder created by Playwright
          if (originalFolder !== outputDir && fs.existsSync(originalFolder)) {
            fs.rmSync(originalFolder, { recursive: true, force: true });
          }
        } catch (err) {
          console.error(`Failed to organize marketing video: ${err}`);
        }
      }
    }
  }
}
