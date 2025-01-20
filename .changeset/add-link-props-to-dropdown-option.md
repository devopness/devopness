---
"@devopness/ui-react": minor
---

Added `linkProps` property to `DropdownOption` type to provide granular control over link behavior when using URL options.

### What Changed

- Added new `linkProps` property of type `LinkProps` to `DropdownOption`
- Link options now support all props from the base `Link` component
- Properties like `target`, `rel`, `hideExternalUrlIcon` and custom styling can be configured

### Why

Previously, when using URL-based dropdown options, developers had limited control over the link's behavior. This change provides more flexibility for customizing link appearance and functionality while maintaining a clean API.

### Migration Guide

The change is fully backwards compatible. To take advantage of the new functionality, you can optionally add `linkProps` to your URL-based dropdown options:

```typescript
<Dropdown
  options={[{
    label: "Documentation",
    url: "https://docs.example.com",
    linkProps: {
        target: "_blank",
        hideExternalUrlIcon: true,
    }
  }]}
/>
```