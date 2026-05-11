---
"@devopness/ui-react": patch
---

Fix broken layout in Dropdown options whose `url` prop is set: render the external URL icon inline with the badge and label (instead of falling onto a new line below), make the `:hover` background cover the full row including the icon area, and let the link navigate when `onSelect` is also defined on the Dropdown
