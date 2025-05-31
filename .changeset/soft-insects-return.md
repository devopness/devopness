---
"@devopness/sdk-python": patch
---

Add validation for base_url in DevopnessClientConfig to ensure it starts with http:// or https://, raising a clear error if invalid.
