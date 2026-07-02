---
"@devopness/sdk-js": patch
---

Fix `accessToken` expiry checks so the SDK can decode JWT payloads in browser runtimes and safely ignore malformed tokens instead of throwing from the axios error path.
