# Theming & Styling

**STRICT ENFORCEMENT:** Adhering to these rules for styling, colors, component variants, and CSS variable naming conventions is strictly enforced to ensure a consistent and professional UI.

## Strictly Enforced Rules
1. **Never hardcode hex colors or use arbitrary CSS colors.** If you must use custom styles to override or apply a color, you **MUST** use Fluid UI CSS variables.
   - *Incorrect:* `<div style={{ color: '#ff0000' }}>`
   - *Correct:* `<div style={{ color: 'var(--f-clr-error-200)' }}>`
2. **Strict CSS Variable Naming:** You **MUST** strictly adhere to the Fluid UI CSS variable naming schema.
   - **Color variables** MUST end with a numeric step suffix (`-100`, `-200`, up to `-900`). **NEVER** omit the numeric step (e.g., `--f-clr-primary` is INVALID; use `--f-clr-primary-100`).
   - **Spacing & Size variables** MUST use exact Fluid UI size suffixes (`-xxs`, `-xsm`, `-sml`, `-med`, `-lrg`, `-xlg`, `-xxl`). **NEVER** use standard web/Tailwind suffixes like `-lg`, `-md`, `-sm`, or `-xl`.
3. **Always use built-in variants and props before writing custom CSS.** 
   - Many components support a `round` prop. Always prefer this over writing a custom `border-radius`.
   - Prefer built-in `size`, `variant`, and `color` props for components.
4. **Color Prop Usage:** When a component accepts a `color` prop, always pass `--f-clr-*` Fluid UI CSS variables (e.g., `color="var(--f-clr-primary-100)"`). For destructive actions or error states, use semantic error variables.
   - *Example:* `<Button color="var(--f-clr-error-200)">Delete</Button>`

## CSS Variable Naming & Token Schema

Fluid UI CSS variables follow precise formatting conventions:

- **Color Variables (`--f-clr-[palette]-[step]`)**: MUST include the numeric step suffix (`-100` to `-900`). Index `0` of a palette array corresponds to `-100` (`-200` is index 1, up to `-N00`).
- **Spacing & Size Variables (`--f-spacing-[size]`)**: Suffixes span from `-xxs` to `-xxl` (`-xxs`, `-xsm`, `-sml`, `-med`, `-lrg`, `-xlg`, `-xxl`).
  - *Component Size Availability Note:* Not all components support the full `xxs`–`xxl` range; some accept a subset (e.g., only `xsm` to `lrg`). Always verify supported sizes via component props / TS types.

| Pattern | ❌ Invalid | ✅ Valid Fluid Variable |
| :--- | :--- | :--- |
| **Color** (Step required) | `var(--f-clr-primary)` | `var(--f-clr-primary-100)` |
| **Spacing / Size** (Fluid suffixes) | `var(--f-spacing-lg)` | `var(--f-spacing-lrg)` |

## Utility Classes and the `classes()` Helper
- If `includeUtilityClasses: true` is set in `fluid.config.js`, Fluid UI generates color utility classes in the format `bg-primary-100` (for background-color) and `cl-primary-100` (for text color).
- The `classes()` function from `@infinityfx/fluid/utils` is a helper function that provides full TypeScript autocomplete for these specific Fluid utility classes.
- You can use `classes()` to apply a standard list of classes with autocomplete, and it *also* supports conditionally applying classes when you need dynamic styling.
  
  *Example (Standard Autocompleted usage):*
  ```tsx
  import { classes } from '@infinityfx/fluid/utils';

  <div className={classes('bg-surface-100', 'cl-text-100')}>
      Standard usage with autocomplete
  </div>
  ```

  *Example (Conditional usage):*
  ```tsx
  <div className={classes('bg-surface-100', isVisible && 'cl-primary-100')}>
      Conditional usage
  </div>
  ```

## Component-Specific Styling & Preferences
- **Field Contrast:** When a Field-based component (e.g., `Field`, `Select`, `Autocomplete`, `ColorField`) is placed inside a container with a lighter surface color (like a `Card` or `Modal`), prefer `variant="minimal"` for better contrast.
- **Inverted Menus:** Components like `ActionMenu`, `Combobox`, `Select`, and `Tooltip` support an `inverted` variant. This makes the menu dark in a light theme, and light in a dark theme. 
  - **Note:** This is purely an optional stylistic preference and is not strictly necessary for proper contrast. Use it only when a highly contrasty look is explicitly desired.
