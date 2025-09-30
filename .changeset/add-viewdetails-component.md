---
"@devopness/ui-react": minor
---

Add new `ViewDetails` component

### What Changed

* Introduced `ViewDetails` to display multiple sections of detail items with labels and values.
* Supports optional icons, navigation links, copy-to-clipboard functionality, hidden/sensitive content with toggle, and tooltips.
* Added `ViewDetailsContent` for individual detail rows and `ViewDetailsLoading` for the loading state.

### Example Usage

```tsx
import { ViewDetails, ViewDetailsContent, ViewDetailsLoading } from '@devopness/ui-react'
import { DetailsContentProps } from '@devopness/ui-react'

const sampleData: { label: string; items: DetailsContentProps[] }[] = [
  {
    label: 'User Info',
    items: [
      { label: 'Name', value: 'John Doe' },
      { label: 'Email', value: 'john@example.com', isCopyToClipboard: true }
    ]
  }
]

<ViewDetails navigationComponent={NavigationLink} data={sampleData} />

<ViewDetailsContent
  label="Website"
  value="https://example.com"
  url="https://example.com"
  navigationComponent={NavigationLink}
/>

<ViewDetailsLoading />
```

This component improves the display of structured information, enables consistent handling of sensitive or interactive content, and follows accessibility and type-safety guidelines in the Devopness UI library.
