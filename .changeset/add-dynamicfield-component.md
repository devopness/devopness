---
"@devopness/ui-react": minor
---

Add new `DynamicField` component

### What Changed
- Introduced a flexible `DynamicField` component capable of rendering different input types based on configuration:
  - `Input` for string and number fields
  - `TextArea` for multi-line text
  - `Select` for boolean (Yes/No) choices
- Supports:
  - Label configuration with help tooltips
  - Error state handling with built-in `ErrorMessage`
  - External value and event control (agnostic to form libraries)
  - Sensitive data masking (`sensitive` prop)

### Example Usage

```tsx
<DynamicField
  name="age"
  value={age}
  onChange={(e) => setAge(e.target.value)}
  validation={{ type: 'number', min: 0, max: 100 }}
  labelProps={{ value: 'Age' }}
/>
```
This component provides a highly reusable and configurable way to render form fields dynamically.
It standardizes input rendering across the application, improves type safety and accessibility, and simplifies integration with different form management libraries in the Devopness UI library.
