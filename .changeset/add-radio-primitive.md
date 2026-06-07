---
"@devopness/ui-react": minor
---

Add Radio primitive for grouped radio inputs

New `Radio` namespace export with `Radio.Root` and `Radio.Item`. `Root` is
a controlled component (`value` + `onChange`) that can be paired with any
form library (e.g. react-hook-form's `Controller`). Supports row/column
direction, an error message, and disabled items.

Migrated from `devopness-web-app`'s local component so the same UI can be
reused across Devopness products. The form-library integration was
removed from the primitive itself to keep it library-agnostic — callers
are now responsible for wiring it into their form state.
