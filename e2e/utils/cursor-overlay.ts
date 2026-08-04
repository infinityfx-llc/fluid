import { Page } from '@playwright/test';

/**
 * Injects an animated cursor & tap indicator for video recordings.
 */
export async function injectCursorOverlay(page: Page) {
  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      let isDown = false;

      // Create cursor dot (hidden by default)
      const cursor = document.createElement('div');
      cursor.id = '__pw_marketing_cursor__';
      cursor.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(128, 128, 128, 0.75);
        border: 2px solid rgba(190, 190, 190, 0.85);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        pointer-events: none;
        z-index: 999999;
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
        transition: opacity 0.12s ease-out, transform 0.08s ease-out, background-color 0.1s ease-out;
      `;
      document.body.appendChild(cursor);

      // Track cursor position
      window.addEventListener('pointermove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        if (isDown) {
          cursor.style.opacity = '1';
        }
      });

      // Tap / Click ripple effect with radial gradient
      const createRipple = (x: number, y: number) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(128, 128, 128, 0.7) 0%, rgba(128, 128, 128, 0.25) 60%, rgba(190, 190, 190, 0.75) 100%);
          border: 2px solid rgba(190, 190, 190, 0.85);
          pointer-events: none;
          z-index: 999998;
          transform: translate(-50%, -50%) scale(1);
          animation: __pw_ripple 0.35s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        `;

        if (!document.getElementById('__pw_ripple_styles')) {
          const style = document.createElement('style');
          style.id = '__pw_ripple_styles';
          style.innerHTML = `
            @keyframes __pw_ripple {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              100% { transform: translate(-50%, -50%) scale(4.5); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }

        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 380);
      };

      window.addEventListener('pointerdown', (e) => {
        isDown = true;
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.style.opacity = '1';
        cursor.style.transform = 'translate(-50%, -50%) scale(0.85)';
        cursor.style.backgroundColor = 'rgba(100, 100, 100, 0.9)';
        createRipple(e.clientX, e.clientY);
      });

      const handlePointerUp = () => {
        isDown = false;
        cursor.style.opacity = '0';
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'rgba(128, 128, 128, 0.75)';
      };

      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    });
  });
}
