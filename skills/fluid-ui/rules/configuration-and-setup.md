# Configuration & Setup

These rules apply when setting up Fluid UI, modifying its configuration, or handling CSS compilation.

## `FluidProvider`
- The entire application MUST be wrapped in a `<FluidProvider>`. This ensures correct styling and theming across all components.
- **Optional Quality of Life (SSR):** For Server-Side Rendered (SSR) apps (like NextJS), you can fetch the color scheme from cookies using the `COLOR_SCHEME_COOKIE` constant from `@infinityfx/fluid/utils`. Passing this to `initialColorScheme` prevents a flash of incorrect theme colors before hydration. This is completely optional.
  
  *Example (NextJS App Router):*
  ```tsx
  import { cookies } from 'next/headers';
  import { FluidProvider } from '@infinityfx/fluid';
  import { COLOR_SCHEME_COOKIE } from '@infinityfx/fluid/utils';

  export default function RootLayout({ children }) {
      const cookieStore = cookies();
      const initialScheme = cookieStore.get(COLOR_SCHEME_COOKIE)?.value;

      return (
          <html>
              <FluidProvider initialColorScheme={initialScheme}>
                  <body>
                      {children}
                  </body>
              </FluidProvider>
          </html>
      );
  }
  ```
- Use the `localeTokens` prop on `FluidProvider` to set translations for internal accessibility labels if a language other than English is required.

## Compilation
- Fluid UI requires a compilation step to parse used styles: `npx fluid compile`.
- Use the `-d` flag (`npx fluid compile -d`) during development to prevent tree-shaking styles. This prevents missing styles when actively adding new components.
- Do **not** use the `-d` flag in production builds, as it inflates bundle size.
- Prepend compilation to your `package.json` scripts so styles are generated automatically:
  ```json
  "scripts": {
      "dev": "npx fluid compile -d && next dev",
      "build": "npx fluid compile && next build"
  }
  ```

## `fluid.config.js`
- **Working Directories (`paths`):** Specify glob patterns in `paths` so Fluid knows where to scan for component usage. Default if omitted:
  ```javascript
  module.exports = {
      paths: [
          './src/**/*.{jsx,tsx}',
          './app/**/*.{jsx,tsx}',
          './pages/**/*.{jsx,tsx}',
          './components/**/*.{jsx,tsx}'
      ],
  }
  ```
- **Output:** Use `cssOutput: 'manual'` for frameworks like NextJS to prevent caching issues. The compiled CSS will be output as `fluid.css` in the project root, which must be imported manually into your entry point file.
- **Palettes:** When adding custom palettes (other than `light` or `dark`), you **must** define *all* color entries, adhering strictly to the required array lengths:
  - `primary`: **6 values**
  - `grey`: **9 values**
  - `surface`: **3 values**
  - `error`: **4 values**
  - `fg`: **2 values**
  - `text`: **at least 2 values**
  - `accent`, `heading`, `bg`: **at least 1 value**
  - *Preference:* It is almost always preferred to let the user or the `mixColors` utility (`from '@infinityfx/fluid/utils'`) generate color scales, spacing, radius, and font sizes for the config file rather than hardcoding arbitrary scales.
- **Fonts:** Specify fonts in the `theme.font.family` key. This can be a direct font name or a CSS variable (e.g., `var(--font-inter)`).
- **Icons:** Fluid UI uses Lucide icons (`react-icons/lu`) internally by default. To override them, specify substitutions in the `icons` object using external package imports (from `node_modules`).
  ```javascript
  const { LuX } = require('react-icons/lu');
  module.exports = {
      icons: {
          close: LuX,
      }
  }
  ```
  - *Full Customizable Icon Keys (27 total):* `add`, `check`, `close`, `collapseUp`, `collapseSidebar`, `copy`, `dark`, `down`, `expand`, `expandDown`, `expandSidebar`, `first`, `hide`, `last`, `left`, `light`, `more`, `search`, `show`, `sort`, `sortAscend`, `sortDescend`, `up`, `upload`, `remove`, `right`.
  - *Rule:* If you plan to use an icon library other than Lucide across the project, you must override **all** 27 internal icons to maintain visual consistency.
