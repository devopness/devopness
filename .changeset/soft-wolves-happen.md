---
"@devopness/sdk-python": patch
---

Fix Python SDK error formatting for API error values that are not lists, such as a single number like `30` in `errors.retry_after_seconds`, and for nested API error values.
