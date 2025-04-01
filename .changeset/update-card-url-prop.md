---
"@devopness/ui-react": minor
---

Enhanced Card component URL handling

### What Changed

- Updated Card component's URL handling to support full LinkProps configuration
- Added support for all Link component props (except 'style') in:
  - Card's main `url` prop
  - Footer action `url` properties
- Enables granular control over link behavior including `target`, `rel`, and other Link component properties

### Example Usage

```tsx
<Card
  title="Example Card"
  url="/dashboard"
  urlProps={{
    target: '_blank',
    rel: 'noopener',
    hideExternalUrlIcon: true
  }}
  footer={[
    {
      label: 'View Details',
      url: '/details',
      urlProps: {
        target: '_self',
        hideExternalUrlIcon: true
      }
    }
  ]}
/>
```

This enhancement provides more flexibility in configuring Card's link behavior while maintaining backward compatibility with existing Card implementations.