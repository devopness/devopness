---
"@devopness/ui-react": minor
---

Add new `Status` component

### What Changed
- Introduced `Status` component to display action statuses with icon, color, and tooltip.
- Supports human-readable status and reason.
- Uses `ViewDetailsContent` for consistent rendering in Devopness UI style.

### Example Usage
```tsx
<Status
  status="completed"
  statusHumanReadable="Completed"
  statusReasonHumanReadable="All tasks finished successfully"
/>

<Status
  status="failed"
  statusHumanReadable="Failed"
  statusReasonHumanReadable="Error occurred"
/>
```
This component improves consistency for displaying action statuses in forms, lists, and detail views.
