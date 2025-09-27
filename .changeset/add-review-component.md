---
"@devopness/ui-react": minor
---

Add new `Review` component

### What Changed
- Introduced `Review` component for displaying label/value pairs with optional icon and prefix.
- Handles icon placement before or after the label using `isIconAfterLabel`.
- Supports bold label, prefix margin, and custom background colors.
- Provides `ReviewBox` as an optional container to group multiple `Review` components in examples.
- Follows Devopness UI design and accessibility standards.

### Example Usage
```tsx
import { Review, ReviewBox } from '@devopness/ui-react'

<Review content="Status: Approved" icon="check" prefix="Info" />

<ReviewBox type="default">
  <Review content="Status: Approved" icon="check" prefix="Info" />
  <Review content="Score: 85%" icon="star" isIconAfterLabel />
</ReviewBox>
```
This component enhances form handling consistency, improves reusability, and follows Devopness UI guidelines for accessibility and type safety.
