# Theming & Styling

**STRICT ENFORCEMENT:** Adhering to these rules for styling, colors, and component variants is strictly enforced to ensure a consistent and professional UI.

## Strictly Enforced Rules
1. **Never hardcode hex colors or use arbitrary CSS colors.** If you must use custom styles to override or apply a color, you **MUST** use Fluid UI CSS variables.
   - Example: `var(--f-clr-primary-100)`. Here, `primary` refers to the palette name, and `-100` corresponds to index `0` of the color array (`-200` is index 1, `-300` is index 2, up to `-N00`).
   - *Incorrect:* `<div style={{ color: '#ff0000' }}>`
   - *Correct:* `<div style={{ color: 'var(--f-clr-error-200)' }}>`
2. **Always use built-in variants and props before writing custom CSS.** 
   - Many components support a `round` prop. Always prefer this over writing a custom `border-radius`.
   - Prefer built-in `size`, `variant`, and `color` props for components.
3. **Color Prop Usage:** When a component accepts a `color` prop, always pass `--f-clr-*` Fluid UI CSS variables (e.g., `color="var(--f-clr-primary-100)"`). For destructive actions or error states, use semantic error variables.
   - *Example:* `<Button color="var(--f-clr-error-200)">Delete</Button>`

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
