---
"@devopness/ui-react": minor
---

Add new `FlexContainer` and `CopyToClipboard` components

### What Changed

- Introduced the `FlexContainer` component for building flexible layouts easily with consistent styling.
- Added the `CopyToClipboard` component that allows users to copy content to the clipboard with visual feedback via tooltip.
- Both components follow the Devopness UI guidelines for reusability, type safety, and documentation.

### Example Usage

```tsx
// FlexContainer
<FlexContainer justify="center" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</FlexContainer>

// CopyToClipboard
<CopyToClipboard id="example">
  Copy me
</CopyToClipboard>
```

These components improve UI consistency and developer productivity by providing reusable building blocks for layouts and clipboard interactions.
