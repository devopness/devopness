---
"@devopness/ui-react": minor
---

Add new `EmptyData` component for empty states display

### What Changed

- Introduced the `EmptyData` component to visually represent empty states in pages or sections with no data
- Supports optional `image` and `message` props to customize the content
- Accepts an `isSmallContainer` flag to adjust image size for smaller layouts

### Example Usage

```tsx
<EmptyData />

<EmptyData
  isSmallContainer
  image="/assets/images/empty-projects.png"
  message="No projects have been created yet. Use the Add button to get started."
/>
```

This component helps improve user experience by clearly communicating when there's no content to show, offering optional visual and text customization.