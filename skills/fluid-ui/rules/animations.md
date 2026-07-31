# Animations

Guidelines for using `@infinityfx/lively` to animate components. 

Fluid UI components have opinionated, beautiful animations built-in. When animating composed components, custom elements, or layouts, you should use `@infinityfx/lively` to maintain consistency across the app.

> **Note on Built-in Components:** Internal animations on built-in Fluid components are pre-applied and cannot be overridden or modified. Do **not** attempt to add custom CSS transitions or override keyframes on built-in Fluid UI components.

For full Lively documentation, refer to: [https://lively.infinityfx.dev/llms.txt](https://lively.infinityfx.dev/llms.txt)

## Creating Custom Animations

- Use `<Animate>` for standard animations.
- Use `<LayoutGroup>` wrapping the conditional render for exit/unmount animations.

```tsx
import { Animate, LayoutGroup } from '@infinityfx/lively';
import { ViewAnimation, TextAnimation } from '@infinityfx/lively/presets';

// Viewport Enter Animation
<ViewAnimation enter={{ opacity: [0, 1] }}>
    <div>Content that fades in when visible</div>
</ViewAnimation>

// Mount/Unmount Animations
<LayoutGroup>
    {isVisible && (
        <Animate
            animate={{ opacity: [0, 1] }}
            triggers={{
                animate: ['mount', { on: 'unmount', reverse: true }]
            }}
        >
            <div>Content that animates in and out</div>
        </Animate>
    )}
</LayoutGroup>
```

## Component-Specific Animation Behavior
Some structural components allow or require you to inject custom entry animations for their inner content.

- **Navigation Menu:** You can specify your own enter animation for grouped links by providing `<Animate inherit>` as the wrapper. The `inherit` prop ensures the animation fires when the parent navigation group is opened.
  ```tsx
  <NavigationMenuRoot>
      <NavigationMenuGroup label="Products">
          <Animate
              inherit
              animate={{ translate: ['100% 0%', '0% 0%'], duration: .35, delay: .25 }}
          >
              <NavigationMenuLink>...</NavigationMenuLink>
          </Animate>
      </NavigationMenuGroup>
  </NavigationMenuRoot>
  ```
- **Popovers:** When building custom popovers, you can animate the content inside `PopoverContent` using `Animate` linked to mount/unmount triggers. Use a unique `key` prop so React tracks element identity during layout transitions.
  ```tsx
  <PopoverRoot>
      <PopoverTrigger><Button>Open</Button></PopoverTrigger>
      <PopoverContent>
          <Animate
              key="popover-content"
              animate={{ opacity: [0, 1], scale: [0.9, 1], duration: .175 }}
              triggers={{ animate: ['mount', { on: 'unmount', reverse: true }] }}
          >
              <div>My custom animated popover content</div>
          </Animate>
      </PopoverContent>
  </PopoverRoot>
  ```
