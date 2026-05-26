---
"@devopness/ui-react": minor
---

Support disabled state on Card add CTA button

The `addUrl` prop now accepts an object in addition to a plain string,
following the same pattern as the existing `url` prop. The object form
supports all `LinkProps` fields plus `disabled` and `disabledTooltip`:
when `disabled: true`, the add button renders as a non-interactive element
with `cursor: not-allowed` and an optional tooltip message instead of
navigating to the URL.
