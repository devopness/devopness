---
"@devopness/ui-react": patch
---

### What Changed
Implements resize observer to guard state updates in the Tooltip component, avoiding redundant setState calls that causes a "Maximum update depth exceeded" runtime error. Now, the effect only updates state when the measured overflow value actually changes.
