---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

Refactored `add` and `rotate` methods to accept `expires_at: datetime` instead of `expires_in`.

This change allows creating tokens with custom expiration dates, limited to **up to one year in the future**.
