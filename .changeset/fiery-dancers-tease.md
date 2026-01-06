---
"@devopness/ui-react": patch
---

Guard custom element registration and prevent server-side DOM access so the package is safe to import during Next.js (App Router) rendering/building.

- Mark client-only components as `use client` where appropriate to keep them out of 	server bundles and to ensure runtime-only APIs run only in the browser.
- Ensure React remains a peer dependency and avoid bundling multiple React runtimes;
- Prefer `sideEffects: false` and rebuild artifacts to produce consistent ESM and CJS 	outputs.

These changes make `@devopness/ui-react` safe to import during Next.js server rendering/building and prevent runtime errors caused by top-level DOM API usage.
