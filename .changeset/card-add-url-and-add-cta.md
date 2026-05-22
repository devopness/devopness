---
"@devopness/ui-react": minor
---

Add `addUrl` and implement `url` props on `Card` component

- `addUrl`: renders a ghost-style add CTA button in the card header that navigates to the given URL
- `url`: when provided, the card title is rendered as a navigation link; supports both string URLs and object form (e.g. `{ to, target }`)
