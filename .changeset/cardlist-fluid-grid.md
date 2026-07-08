---
"@devopness/ui-react": patch
---

Fix `CardList`'s grid to use a fluid `auto-fill`/`minmax(250px, 1fr)` layout instead of a fixed 1/2/3-column breakpoint grid. The fixed grid capped the desktop layout at 3 columns regardless of viewport width, wasting horizontal space and wrapping cards to a new row even on very wide screens.
