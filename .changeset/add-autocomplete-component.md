---
"@devopness/ui-react": minor
---

Add new `Autocomplete` component

### What Changed
- Introduced the `Autocomplete` component wrapping MUI Autocomplete with a Devopness Input.
- Supports free text input, custom options, and styled popper.
- Maintains full typing for inputProps and autocompleteProps.

### Example Usage
```tsx
<Autocomplete
  inputProps={{ placeholder: 'Type something' }}
  autocompleteProps={{
    options: ['Option 1', 'Option 2'],
    value: '',
    onChange: (event, value) => console.log(value)
  }}
/>
```
This component improves form handling consistency, enhances reusability, and follows Devopness UI guidelines for accessibility and type safety.
