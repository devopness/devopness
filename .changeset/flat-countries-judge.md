---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

Updated SDK methods that accept `hook_type` to use the `HookTypeParam` enum instead of plain strings.
This change clearly defines the allowed values for this field, reducing the likelihood of user errors.
