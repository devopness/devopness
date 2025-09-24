---
"@devopness/ui-react": minor
---

Add new `RadioSelectCards` component

### What Changed
- Introduced the `RadioSelectCards` component to render radio options as selectable cards.
- Supports icons, labels, and custom styling per card.
- Handles loading state via `RingLoader`.
- Handles error messages using the `ErrorMessage` primitive.
- Forwards refs and accepts shared `inputProps` for each radio input.

### Example Usage
```tsx
<RadioInput
  name="exampleRadio"
  data={[
    { value: 'gitlab', label: 'Gitlab', icon: 'gitlab' },
    { value: 'github', label: 'Github', icon: { name: 'github', color: 'blue' } },
  ]}
/>
```
This component enhances form handling consistency, improves reusability, and follows Devopness UI guidelines for accessibility and type safety.
