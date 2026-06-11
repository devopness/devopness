---
"@devopness/ui-react": minor
---

Add `CardGrid` primitive

A responsive grid layout for collections of card-shaped children. Does not
impose any visual style on the cards themselves — the consumer controls
tile content and decoration. Column counts are configurable per breakpoint
(`mobile` / `tablet` / `desktop`) and default to `1` / `2` / `4`.

```tsx
import { CardGrid } from '@devopness/ui-react'

<CardGrid rowHeight="160px">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</CardGrid>
```
