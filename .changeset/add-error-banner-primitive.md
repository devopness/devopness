---
"@devopness/ui-react": minor
---

Add ErrorBanner primitive for route-level error states

New `ErrorBanner` component for displaying generic, content-driven error
states in routes (e.g., OAuth failures, missing parameters, API errors).

Features:

- Title and description for error context
- Optional `errorDetail` field for technical information
- Optional `action` prop with label and href for user recovery paths
- Uses shared `Link` primitive for consistent navigation behavior
- Includes accessibility semantics (`role="alert"`, `aria-live="assertive"`)
- Full test coverage and Storybook stories

Typical use cases: OAuth authorization errors, API callback failures,
missing or invalid request parameters.
