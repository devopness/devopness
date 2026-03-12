---
"@devopness/ui-react": patch
---

Add `allwaysVisible` prop to `CopyToClipboard` component to allow the copy icon to remain permanently visible with full opacity.

- Pass optional `allwaysVisible` prop through the component to styled elements;
- Update `CopyToClipboard` styled components to conditionally disable hover effects and set initial opacity;
- Use transient props (`$allwaysVisible`) to prevent React warnings by consuming the prop before it reaches the DOM;
- Expand the test suite to include coverage for the new prop and ensure reliable clipboard error handling.

This improvement provides better visibility of the copy action when required by the design, without breaking existing hover-based behavior.
