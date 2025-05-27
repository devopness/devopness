---
"@devopness/sdk-python": patch
---

Corrected the async client _save_access_token method to use aread() instead of read() for reading response content, preventing runtime errors with async streams.
