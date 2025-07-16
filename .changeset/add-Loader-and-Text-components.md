---
"@devopness/ui-react": minor
---

Add `Loader` and `Text` components to the design system

### What Changed

- Introduced the `Text` component based on MUI's `Typography`
- Added the `Loader` component with support for multiple variants: `bar`, `circle`, `ring`, and `page`
- Added the [react-spinners](https://www.npmjs.com/package/react-spinners) library to provide a variety of customizable loading spinners
- Loader components are built using `react-spinners` with props for `color`, `size`, `speedMultiplier`, `text`, `isAlignLeft`, and `paddingTop`

### Example Usage

```tsx
<Text variant="h4" isSmall>
  Loading data...
</Text>
```

```tsx
<Loader variant="circle" color={getColor("purple.800")} text="Please wait..." />
```

These new components enhance UI consistency and developer experience by providing ready-to-use typography and loading visuals.
