---
"@devopness/ui-react": minor
---

Add new `Container` component

### What Changed
- Introduced the `Container` component that provides a responsive 12-column grid layout with a styled content wrapper.
- Supports optional removal of the default top margin (42px).
- Allows customizing background color and height of the inner wrapper.

### Example Usage
```tsx
<Container
  shouldHaveTopMargin={false}
  styles={{ backgroundWrapperContent: '#f5f5f5', height: 400 }}
>
  <p>Page content here</p>
</Container>
```
This component improves layout consistency across the application and follows Devopness UI guidelines for reusability, type safety, and documentation.
