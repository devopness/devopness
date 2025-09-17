---
"@devopness/ui-react": minor
---

Add new `Illustration` component

### What Changed
- Introduced the `Illustration` component that centers its children horizontally and vertically.
- Provides a fixed height of `126px` and full width.
- Adds a bottom border using the theme color `slate.300`.

### Example Usage
```tsx
<Illustration>
  <img src="logo.png" alt="Logo" />
</Illustration>
```
This component improves visual consistency across the application and follows Devopness UI guidelines for reusability, type safety, and documentation.
