---
"@devopness/ui-react": minor
---

Add new `FormLoading` component

### What Changed
- Introduced the `FormLoading` component, a structured loading state for forms.
- Uses `Skeleton` placeholders for title, paragraph, separator line, and action buttons.
- Accepts optional `ariaLabel` prop for accessibility.

### Example Usage
```tsx
<FormLoading ariaLabel="Loading form content" />
```
This component provides a consistent loading UI for forms across the application, improving UX and accessibility.
