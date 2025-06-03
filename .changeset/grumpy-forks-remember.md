---
"@devopness/sdk-python": patch
---

Improved how enum values (like hook types) appear when used in strings.  
For example, when building URLs or printing values, you'll now see `"incoming"` instead of something like `"HookTypeParam.INCOMING"`.

This makes the SDK easier to use and outputs cleaner, more expected values in logs, strings, and requests.
