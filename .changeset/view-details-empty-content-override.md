---
"@devopness/ui-react": minor
---

Add `emptyContent` prop to `ViewDetailsContent` to override the default empty-value fallback

`ViewDetailsContent` previously hardcoded an em dash (`—`) as the fallback for an empty/undefined `value`, with no way for consumers to override it. A new optional `emptyContent` prop lets consumers pass their own fallback content (e.g. `-`, `N/A`) instead.
