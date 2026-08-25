---
"@devopness/sdk-python": patch
---

Report Devopness SDK errors instead of `AttributeError` and `UnboundLocalError` when the SDK is used before a client is created, or when a request body has an unsupported type.
