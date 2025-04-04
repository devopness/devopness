---
"@devopness/ui-react": patch
---

Fix `shieldLock` icon rendering error

Previously, the `shieldLock` icon was incorrectly typed as 'icon', which attempted to use the SVG URL as a React component, causing a DOM error:
"DOMException: Failed to execute 'createElement' on 'Document': The tag name provided is not a valid name."

This change:
- Updates the shieldLock icon type from 'icon' to 'image', to correctly render it as an <img> element
- Fixes the runtime error when using the `shieldLock` icon
- Maintains backward compatibility - the icon name and usage remain the same
