---
"@devopness/ui-react": minor
---

Add new `Popover` component

### What Changed
- Introduced the `Popover` component as a flexible panel anchored to an element.
- Supports optional header (`title`) and footer content (`footer`).
- Handles close actions via built-in close button.
- Uses `ConditionalWrapper` to render footer conditionally.
- Follows Devopness UI design and accessibility standards.

### Example Usage
```tsx
<Popover
  open={isOpen}
  anchorEl={anchorElement}
  onClose={() => setIsOpen(false)}
  title="Popover Title"
  footer={<div>Footer content</div>}
>
  <div>Main content of the popover</div>
</Popover>
```
This component improves reusability for popover panels and provides a consistent header/footer layout.
