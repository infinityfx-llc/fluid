import { Page } from '@playwright/test';

/**
 * Smoothly scrolls the page or a target container element with custom duration and easing.
 */
export async function smoothScroll(
  page: Page,
  deltaY: number,
  durationMs: number = 800,
  selector?: string
) {
  await page.evaluate(
    ({ deltaY, durationMs, selector }: { deltaY: number; durationMs: number; selector?: string }) => {
      return new Promise<void>((resolve) => {
        const target = selector
          ? document.querySelector(selector)
          : window;

        if (!target) {
          resolve();
          return;
        }

        const startY = selector
          ? (target as HTMLElement).scrollTop
          : window.scrollY;
        const startTime = performance.now();

        function step(currentTime: number) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          
          // Smooth ease-in-out cubic curve
          const easeProgress =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const currentY = startY + deltaY * easeProgress;

          if (selector) {
            (target as HTMLElement).scrollTop = currentY;
          } else {
            window.scrollTo(0, currentY);
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }

        requestAnimationFrame(step);
      });
    },
    { deltaY, durationMs, selector }
  );
}
