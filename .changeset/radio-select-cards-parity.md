---
"@devopness/ui-react": patch
---

Add a mobile-responsive layout to `RadioSelectCards` (`@media (max-width: 600px)`: 2-column grid, horizontal card layout, constrained icon size, truncated label), and fix it passing both `checked` and `defaultChecked` to the same radio `<input>` when a data item, or the shared `inputProps`, sets both.
