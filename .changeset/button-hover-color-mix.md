---
"@devopness/ui-react": patch
---

Refine Button hover state: replace the global `filter: brightness(75%)` with `color-mix`-based background and border colors so each `buttonType` darkens (or lightens for outlined/borderless variants) in a way that respects its base color, and transition `background-color` and `border-color` instead of `filter` for a smoother hover
