---
"@devopness/ui-react": minor
---

Add new `TextArea` component

### What Changed
- Introduced the `TextArea` component with flexible props for form usage.
- Supports labels via `Label` primitive.
- Handles error messages (`string`, `FieldError`, or custom object with `message`).
- Optional `isResizable` prop to enable/disable textarea resizing.
- Forwards refs to the native `<textarea>` element.

### Example Usage
```tsx
<TextArea
  label={{ children: 'Comments' }}
  placeholder="Write your message..."
  error={{ message: 'Required field' }}
  isResizable={false}
/>
```
This component improves form handling consistency, enhances reusability, and follows Devopness UI guidelines for accessibility and type safety.
