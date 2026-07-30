---
name: fluid-ui
description: Core guidelines and rules for building React applications with the Fluid UI library.
---

# Fluid UI Guidelines

This skill defines the broad guidelines and architectural rules for working with the **Fluid UI** React component library (`@infinityfx/fluid`). Always adhere to these instructions when building or modifying user interfaces.

## 1. Core Principles

- **Consult Documentation:** Always check the documentation and API references for components if you are unsure what props they support and what values are allowed. 
  - Standard reference: [https://fluid.infinityfx.dev/llms.txt](https://fluid.infinityfx.dev/llms.txt)
  - Full detailed reference: [https://fluid.infinityfx.dev/llms-full.txt](https://fluid.infinityfx.dev/llms-full.txt)
- **Use Built-in Components:** Always prefer built-in components over creating your own from scratch. 
  - *Empty State:* Use `<Empty>` for lists or containers with no content.
  - *Loading Placeholders:* Use `<Skeleton>` to indicate loading states.
  - *Attributes/Information:* Use `<Badge>` for small snippets of info or statuses.
  - *Keyboard Shortcuts:* Use `<Key>` to display shortcuts (e.g., `<Key>Ctrl</Key> + <Key>K</Key>`).
  - *Color Swatches:* Use `<Swatch color="red" />` for visual color representations.
  - *Labels and Error Messages:* Use `<Annotation>` to provide context or errors.
  - *Separation:* Use `<Divider>` instead of standard `<hr />` elements.
  - *Scrollable Containers:* Use `<Scrollarea>` for custom scrolling areas.
- **Strict Adherence:** Rules regarding [Theming and Styling](skills/theming-and-styling.md) (especially concerning color usage and variants) are **STRICTLY ENFORCED**. Do not deviate from them.

## 2. Specialized Skills

For detailed instructions, refer to the following specialized skill files in the `skills/` directory:

- [Configuration and Setup](skills/configuration-and-setup.md): Rules for initializing Fluid UI, compiling CSS, and configuring `fluid.config.js`.
- [Theming and Styling](skills/theming-and-styling.md): **CRITICAL.** Rules for applying colors, variants, and custom styles safely.
- [Component Composition](skills/component-composition.md): Best practices for combining components, accessibility, and layouts.
- [Animations](skills/animations.md): Guidelines for using `@infinityfx/lively` to animate custom elements and layouts.
