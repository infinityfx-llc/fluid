import { Page } from '@playwright/test';

/**
 * Injects an animated cursor & tap indicator and applies CSS layout zoom 
 * so 1080p rendering triggers mobile media queries (@media max-width: 480px) with 100% vector sharpness.
 */
export async function injectCursorOverlay(page: Page, mobileZoomFactor: number = 2.5) {
  await page.addInitScript(({ zoomFactor }) => {
    window.addEventListener('DOMContentLoaded', () => {
      // 1. Set CSS zoom so layout calculates at mobile scale (1080 / 2.5 = 432px)
      if (zoomFactor > 1) {
        document.documentElement.style.zoom = `${zoomFactor}`;
      }

      // 2. Create cursor dot
      const cursor = document.createElement('div');
      cursor.id = '__pw_marketing_cursor__';
      cursor.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.45);
        border: 2px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
        pointer-events: none;
        z-index: 999999;
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease-out, background-color 0.2s;
      `;
      document.body.appendChild(cursor);

      // Track cursor position
      window.addEventListener('pointermove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });

      // Tap / Click ripple effect
      const createRipple = (x: number, y: number) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(129, 140, 248, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.85);
          pointer-events: none;
          z-index: 999998;
          transform: translate(-50%, -50%) scale(1);
          animation: __pw_ripple 0.5s ease-out forwards;
        `;

        if (!document.getElementById('__pw_ripple_styles')) {
          const style = document.createElement('style');
          style.id = '__pw_ripple_styles';
          style.innerHTML = `
            @keyframes __pw_ripple {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              100% { transform: translate(-50%, -50%) scale(5.5); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }

        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 550);
      };

      window.addEventListener('pointerdown', (e) => {
        createRipple(e.clientX, e.clientY);
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursor.style.backgroundColor = 'rgba(79, 70, 229, 0.85)';
      });

      window.addEventListener('pointerup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'rgba(99, 102, 241, 0.45)';
      });
    });
  }, { zoomFactor: mobileZoomFactor });
}
