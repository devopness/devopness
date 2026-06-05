---
"@devopness/ui-react": minor
---

Add PermissionCheckboxChip primitive for toggling permissions in forms

New `PermissionCheckboxChip` component — a selectable chip designed for
toggling permissions in forms (e.g. role permissions). It exposes the
`checkbox` ARIA role with full keyboard support (Space and Enter) and
supports states for unchecked, checked, error, disabled, and an optional
tooltip via the `hint` prop.

Migrated from `devopness-web-app`'s local component so the same UI can be
reused across Devopness products.
