---
"@devopness/ui-react": patch
---

Fix the React `widthPercent` warning about custom prop being forwarded to DOM elements.

### What Changed

- Components fixed to stop forwarding transient styling props to DOM elements:
    - `Skeleton` now uses transient props (`$widthPercent`, `$heightPercent`, etc.) so those values are consumed by styled-components and not passed to the DOM.
