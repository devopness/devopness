---
"@devopness/ui-react": minor
---

Add [`components#Card`](./src/components/Templates/Card/Card.tsx) and test utilities

### What Changed

- Added new `Card` component for displaying content in a structured layout
- Added test utilities to standardize component testing
- Updated Tooltip tests to use new test utilities

### Card Component Features

- Flexible header with avatar/icon, title, and subtitle
- Optional indicator display
- Customizable footer with actions
- Support for tooltips on truncated text
- Configurable styling through props

Example usage:

```tsx
<Card
  title="Environment"
  subtitle="Overview of current environments"
  avatarProps={{ backgroundColor: 'blue.500' }}
  icon="cubes"
  footer={[
    {
      label: 'View All',
      url: '/environments',
      tooltip: 'View all environments'
    }
  ]}
/>
```

### Test Utilities

Added new test utilities to help write consistent and maintainable tests:

- `testHoverTooltip`: Standardizes testing of tooltip hover interactions
- Additional utilities can be added to the `test-utils` directory

This change improves testing consistency and reduces duplicate code across component tests.
