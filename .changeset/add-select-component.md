---
"@devopness/ui-react": minor
---

Add new `Select` component

### What Changed
- Introduced a reusable `Select` component built on top of `react-select`.
- Supports:
  - `isReadOnly` mode (non-interactive but still displays value)
  - `isCreatable` for dynamic option creation
  - Custom `noOptionsMessage` handling
  - Error state with built-in `ErrorMessage`
- Includes default styles, custom components, and full Storybook examples.

### Example Usage

```tsx
<Select
  options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
  onChange={setValue}
/>
```
This component provides a flexible and reusable dropdown selection experience, supports dynamic option creation and multi-selection, handles error states and read-only modes consistently, and follows accessibility and type-safety guidelines in the Devopness UI library.
