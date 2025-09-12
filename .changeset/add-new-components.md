---
"@devopness/ui-react": minor
---

Migrate `Cover`, `LoadStarship`, `CheckBox`, `AccordionExpand`, and `PopoverPopupState` components

### What Changed

- **Cover**: Renders a responsive cover with selectable logo variants (`white` or `colored`) and configurable background color. Only visible above the specified `minWidth`.
- **LoadStarship**: Displays an animated starship loader. Supports full-window or container-based layouts.
- **CheckBox**: Enhanced reusable checkbox component with support for controlled/uncontrolled states, strokes, error handling, and multiple sizes.
- **AccordionExpand**: Flexible accordion component that supports standard items with callbacks and optional navigation links via `navigationComponent`.
- **PopoverPopupState**: Wraps Material-UI Popover with `material-ui-popup-state`. Provides a reusable popover with automatic open/close state handling and a button trigger.

### Example Usage

```tsx
// Cover
<Cover minWidth="600px" logo="colored">
  <p>Content inside the Cover component</p>
</Cover>

// LoadStarship
<LoadStarship isFullContainer />

// CheckBox
<CheckBox isChecked={true} isStroke={true} hasError={false} />

// AccordionExpand standard
<AccordionExpand
  label="Options"
  items={[
    { label: 'Option 1', onClick: async () => console.log('clicked') },
    { label: 'Option 2', onClick: () => console.log('clicked too') },
  ]}
/>

// AccordionExpand with navigation
<AccordionExpand
  label="Actions"
  items={[
    { label: 'Go Home', url: '/home' },
    { label: 'Go About', url: '/about' },
  ]}
  navigationComponent={MyNavLink}
/>

// PopoverPopupState
<PopoverPopupState trigger={<Button>Open Popover</Button>}>
  <div>Popover content here</div>
</PopoverPopupState>
```

This migration improves consistency, type safety, reusability, and developer experience by aligning all components with Devopness UI React standards, including proper documentation, testing, and Storybook integration.
