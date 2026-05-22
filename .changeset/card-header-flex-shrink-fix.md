---
"@devopness/ui-react": patch
---

Fix Card header shrinking when children with `height: 100%` are passed

Added `flex-shrink: 0` to `StyledHeader` so the header always keeps its
defined height regardless of sibling flex items inside the card.
