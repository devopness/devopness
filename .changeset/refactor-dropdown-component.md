---
"@devopness/ui-react": minor
---

Refactor `Dropdown` component to add `popoverProps` for more flexible Popover styling

### What Changed

- Refactored the `Dropdown` component to accept a new `popoverProps` property.
- This prop allows consumers to fully customize the Popover, including `slotProps` and `paper` styles.
- If `popoverProps` is not provided, the Popover falls back to a default style, ensuring backward compatibility.

### Example Usage

```tsx
<Dropdown
  id="example-dropdown"
  options={[{ label: 'Option 1' }, { label: 'Option 2' }]}
  anchorType="button"
  label="Open Menu"
  popoverProps={{
    slotProps: {
      paper: {
        marginTop: '5px',
        minWidth: '250px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      },
    },
  }}
/>
```
This change allows full flexibility to style the Popover while keeping a default consistent look when `popoverProps` is not provided.
