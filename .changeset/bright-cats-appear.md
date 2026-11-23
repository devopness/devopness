---
"@devopness/ui-react": patch
---

Update `MultiStepForm` so it only validates the fields that are currently mounted and prevents issues of blocking user to progress in the form when such fields aren't yet mounted on the dom.
