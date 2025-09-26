---
"@devopness/ui-react": minor
---

Add new `ToggleContent` component

### What Changed
- Introduced `ToggleContent` to show/hide sensitive content with a toggle button.
- Supports optional warning when revealing sensitive content (`showWarning`).
- Supports custom hidden content placeholders and disabling them.
- Includes `ToggleContentButton` internally to handle toggle actions.

### Example Usage
```tsx
<ToggleContent
  isSensitiveContent
  showWarning
  hiddenContentPlaceholder="*****"
>
  <span>Secret value</span>
</ToggleContent>
```

```tsx
<ToggleContentButton
  showContent={showFileContent}
  onClick={() => {yourFunction}}
/>
```
This component enhances form handling consistency, improves reusability, and follows Devopness UI guidelines for accessibility and type safety.
