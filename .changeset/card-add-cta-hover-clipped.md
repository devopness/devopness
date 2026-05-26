---
"@devopness/ui-react": patch
---

Fix Card add CTA button hover circle being clipped on the right

Increased the `addCta` grid column from `32px` to `40px` to give enough
room for the button's hover background circle (24px icon + 6px padding
on each side), preventing it from being cut off by the container's
`overflow: hidden`.
