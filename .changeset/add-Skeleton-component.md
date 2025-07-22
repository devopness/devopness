---
"@devopness/ui-react": minor
---

Add new `Skeleton` component for loading placeholders

### What Changed

- Introduced a new `Skeleton` component to represent loading states with optional width, height, percentage sizing, and border radius
- Animated shimmer effect using themed background colors (e.g. `purple.300`, `indigo.100`...)
- Accepts pixel or percentage-based dimensions via `width`, `height`, `widthPercent`, and `heightPercent` props
- `borderRadius` prop for rounded visual 

### Example Usage

```tsx
<Skeleton width={120} height={20} />

<Skeleton widthPercent={100} height={12} borderRadius={8} />
```

This component improves visual feedback for content loading, allowing consistent placeholder elements throughout the app.