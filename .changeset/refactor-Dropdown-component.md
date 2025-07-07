---
"@devopness/ui-react": patch
---

Refactored Dropdown to support both sync and async handlers (onClick / onSelect) using Promise.resolve. Introduced handleDropdownOptionClick to centralize and simplify click/select logic.
