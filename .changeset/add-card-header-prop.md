---
"@devopness/ui-react": minor
---

Add `borderBottomColor` prop to Card component header

### What Changed

- Added new `borderBottomColor` prop to Card's `headerProps` for customizing the bottom border color
- Updated tests to verify border color styling behavior
- Maintains backward compatibility with existing header styling options

### Example Usage

```tsx
<Card
  title="Example Card"
  headerProps={{
    backgroundColor: "blue.100",
    borderBottomColor: "purple.500" // New prop
  }}
/>
```

This enhancement provides more flexibility in styling Card headers by allowing separate control of the border color, independent of the background color. 