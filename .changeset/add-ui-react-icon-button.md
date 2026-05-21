---
"@devopness/ui-react": minor
---

feat(ui-react): add IconButton component

Introduce a new `IconButton` component for icon-only actions. Renders a
circular button wrapping a `<Icon>` from the Devopness icon set, with
three variants tuned for different action weights:

- `primary` — filled purple circle with a white icon, for primary actions.
- `ghost` — no background or border, just the icon, with a subtle hover
  tint, for inline/quiet actions like help, avatar or navigation triggers.
- `outlined` — circular border with a purple icon, for secondary actions
  that still need a visible affordance.

Each variant supports per-instance `color`, `backgroundColor` and
`borderColor` overrides, plus `size` (icon size in px) and `padding`
(around the icon — final button size is `size + 2 * padding`). Hover uses
`color-mix` per variant (darken on filled, light tint on ghost/outlined)
and falls back to `filter: brightness(75%)` when `color-mix` is not
supported. The `:focus-visible` ring follows the variant's dominant color
so the focus outline stays visible against a white page and inherits any
consumer color override.

`aria-label` is required so screen readers always announce a meaningful
name, and the inner icon is `aria-hidden` to avoid double-announcement.

The `outlined` variant grows the outer size by `2px` to keep the visible
padding around the icon consistent with `primary` and `ghost`, so the
1px border does not eat into the content box.

Note: a few entries in the Devopness icon set (brand and technology
logos) are rendered as `<img>` by the underlying `<Icon>` primitive and
therefore ignore the `color` prop; this is a limitation of the icon
primitive itself, not the button.
