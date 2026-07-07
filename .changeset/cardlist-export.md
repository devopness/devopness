---
"@devopness/ui-react": minor
---

Export `CardList` and `CardContent` components. `CardContent` gained a `linkAs` prop to render its internal links through a custom component (e.g. a router's `Link`) instead of a plain `<a>`.

Also fixed `Button`'s deprecated `noMargin` prop leaking onto the underlying DOM `<button>` element, and added an `as` prop to `Link` so it can render as a custom component (with `to` forwarded to it) instead of a plain `<a>`.
