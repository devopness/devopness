---
"@devopness/ui-react": minor
---

Add new `SourceAndHash` component

### What Changed
- Introduced the `SourceAndHash` component to display commit hash with optional deployment source reference.
- Wraps the commit hash and source reference in a link (`Link`) to the commit URL
- Shows a tooltip (`Tooltip`) with the full commit message, which can be customized via `tooltipOptions`.

### Example Usage
```tsx
<SourceAndHash
  commit={{ hash: 'abcd123456', url: 'https://github.com/repo/commit/abcd123456', message: 'Fix bug' }}
  deployment={{ source_ref: 'feature/new-feature', source_type: 'branch' }}
  maxDisplayCharacters={8}
/>
```
This component improves commit display consistency, enhances reusability across the application, and follows Devopness UI guidelines for accessibility, type safety, and visual clarity.
