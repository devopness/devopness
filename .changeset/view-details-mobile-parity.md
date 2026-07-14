---
"@devopness/ui-react": patch
---

Add a mobile-responsive layout to `ViewDetails`/`ViewDetailsContent`: the container grid collapses to a single column below `768px`, the label/value question-mark tooltips are hidden below `600px`, and `CopyToClipboard` becomes always-visible (instead of hover-only) below `600px` — parity with the local implementation this component is meant to replace.
