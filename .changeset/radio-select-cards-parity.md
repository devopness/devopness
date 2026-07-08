---
"@devopness/ui-react": patch
---

Fix `RadioSelectCards` to match `devopness-web-app`'s local version it's replacing: restore the mobile breakpoint (`@media (max-width: 600px)`, 2-column grid, horizontal card layout, constrained icon size, truncated label) that was missing from the package version, and stop passing both `checked` and `defaultChecked` to the same radio `<input>` when a data item is controlled.
