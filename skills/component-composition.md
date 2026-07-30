# Component Composition

Guidelines for effectively combining components, managing layouts, and ensuring accessibility.

## General Composition Guidelines
- Compose components together as much as possible rather than building complex UI elements from scratch. Use built-in combinations before resorting to custom code.
- **The `as` Prop:** The `Button` component uses the `as` prop to render as a different element (e.g., an `a` tag or a NextJS `Link`).
  ```tsx
  <Button as={Link} href="/dashboard">Go to Dashboard</Button>
  ```
- **The `Group` Component Usage:** 
  - `Group` is specifically designed to collapse and visually merge the borders and radii of adjacent elements.
  - Use `Group` when you explicitly want adjacent elements to merge together—either horizontally for inputs, toggles, or buttons, or vertically (`direction="vertical"`) for UI containers like `<Card>`.
    ```tsx
    // Horizontal grouping for toggles/buttons:
    <Group>
        <Toggle><LuUnderline /></Toggle>
        <Toggle><LuBold /></Toggle>
    </Group>

    // Vertical grouping for UI containers:
    <Group direction="vertical">
        <Card>Primary Content</Card>
        <Card color="back">Footer Content</Card>
    </Group>
    ```
  - Do **not** use `Group` as a generic flex container when elements are meant to remain distinct with standard spacing between them (such as standard form fields). Use flex/grid layouts instead.

## Forms and Inputs
- **Field-based Components:** `Autocomplete`, `ColorField`, `DateField`, `Field`, `FileField`, `NumberField`, `PasswordField`, `Pincode`, `Select`, and `TimeField`. These components share the `Field` design container and support `variant="minimal"` for better contrast inside containers like `Card` or `Modal`.
- **Input-like Components:** `Autocomplete`, `Checkbox`, `Chip`, `ColorField`, `DateField`, `DropZone`, `Field`, `FileField`, `NumberField`, `PasswordField`, `Pincode`, `Radio`, `Segmented`, `Select`, `Slider`, `Switch`, `TextArea`, `Toggle`, and `TimeField` (20 components in total). They all render an underlying HTML input and accept a `name` prop for form submission.
- **State:** Input components must either be strictly controlled (passing both `value` and `onChange`) or uncontrolled (e.g., passing `defaultValue` or using `readOnly`).
- **Error States:** All 20 input-like components support an `error` prop, **except `Chip` and `Slider`** (which do not). If truthy, the component gets error state styling. Pair this with an `Annotation` component to display a readable error message to the user.
  ```tsx
  <Annotation label="Username" error={errorMessage}>
      <Field required name="username" error={errorMessage} />
  </Annotation>
  ```
- **Locales:** Components handling dates (`Calendar`, `DateField`, `TimeField`) should explicitly have a `locale` prop set, unless it is intended to fall back to the browser's language.

## Menus: `Select` vs `Combobox`
- **`Select`:** Prefer `Select` for standard dropdown menus where the user chooses one or multiple options. It covers the vast majority of use cases.
- **`Combobox`:** Use `Combobox` *only* when you need granular control over the rendered options. For instance, rendering tooltips on individual options, adding custom dividers, or grouping options visually.
  ```tsx
  // Granular control example with Combobox
  <ComboboxRoot>
      <ComboboxTrigger><Button>Select item</Button></ComboboxTrigger>
      <ComboboxContent>
          <Tooltip content="Description"><ComboboxOption value="1">Item 1</ComboboxOption></Tooltip>
          <Divider size="inherit" label="Group 2" labelPosition="start" style={{ paddingLeft: '.5em' }} />
          <ComboboxOption value="2">Item 2</ComboboxOption>
      </ComboboxContent>
  </ComboboxRoot>
  ```

## Layout and Sizing
- **Scrollable Containers:** Always prefer the built-in `Scrollarea` component for containers that need to be scrollable and have overflowing content.
- **Font-derived Sizing:** `Key`, `Ticker`, `Spinner`, `Dial`, and `Hamburger` do not have a `size` prop. They automatically derive their size from the font size applied at their current layout position.
- **Z-Index:** Fluid UI components generally do not require you to manually manage `z-index`. `NavigationMenu` is the exception; it assumes the parent header will provide a sufficient `z-index` to overlap the rest of the page.

## Accessibility
- **Icon Buttons:** Always wrap buttons that only contain an icon (without text) in a `Tooltip` to ensure an accessible label is provided.
  ```tsx
  <Tooltip content="Close">
      <Button><LuX /></Button>
  </Tooltip>
  ```
- **Clickable Areas:** `Checkbox`, `Radio`, and `Toggle` components can (and should) be wrapped inside a standard HTML `<label>` element to expand their clickable area.
  ```tsx
  <label htmlFor="terms">
      <Checkbox id="terms" />
      Accept the terms and conditions
  </label>
  ```
- **Button Icons:** Buttons automatically adjust padding when an icon is a direct child. If the icon and text are nested or wrapped inside a fragment, explicitly specify the `hasIcon="start"` or `hasIcon="end"` prop on the button to ensure correct padding.
  ```tsx
  <Button hasIcon="end">
      <>Next <LuArrowRight /></>
  </Button>
  ```

## Composition Examples

Here are illustrative examples showing how various Fluid UI components can be combined together depending on your application's needs:

**Split Button Pattern (Group & ActionMenu)**
```tsx
<Group>
    <Button variant="neutral">Send email</Button>
    <ActionMenuRoot>
        <ActionMenuTrigger>
            <Tooltip content="More options">
                <Button variant="neutral"><LuChevronDown /></Button>
            </Tooltip>
        </ActionMenuTrigger>
        <ActionMenuMenu>...</ActionMenuMenu>
    </ActionMenuRoot>
</Group>
```

**Settings Accordion (Forms inside Layouts)**
```tsx
<AccordionRoot>
    <AccordionItem label="Products">
        <label htmlFor="t-shirts" className="...">
            T-shirts
            <Switch id="t-shirts"/>
        </label>
    </AccordionItem>
</AccordionRoot>
```

**Dashboard Metric Card**
```tsx
<Card radius="lrg">
    <CardContent align="horizontal">
        <CardContent>
            <h2>66/100</h2>
            <span>Orders executed</span>
        </CardContent>
        <CircularProgress gap={.05} value={.66}>
            66%
        </CircularProgress>
    </CardContent>
</Card>
```

**Elevated Image Card**
```tsx
<Card elevated style={{ overflow: 'hidden' }}>
    <img src="/my-image.png" alt="My alt text" />
</Card>
```

**Custom Color Picker (Toggle & Swatch)**
```tsx
<div className="...">
    <Tooltip content="White">
        <Toggle compact name="color" value="white">
            <Swatch color="white" />
        </Toggle>
    </Tooltip>
    <Tooltip content="Black">
        <Toggle compact name="color" value="black">
            <Swatch color="black" />
        </Toggle>
    </Tooltip>
</div>
```
