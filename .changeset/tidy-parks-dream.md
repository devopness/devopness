---
"@devopness/sdk-python": patch
---

### Improved SDK resource management

The SDK now reuses a shared HTTP connection across services, reducing memory usage and connection overhead.

Added `close()` and `aclose()` methods for proper resource cleanup.

Use `close()` in synchronous code and `aclose()` in asynchronous code when the SDK client is no longer needed.
