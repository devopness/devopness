---
"@devopness/sdk-python": minor
---

Set a custom `User-Agent` header for all outgoing HTTP requests made by the SDK.

This helps improve observability and debugging by allowing the Devopness Team to identify SDK usage and runtime environment metadata.

The `User-Agent` format looks like:

```
devopness-sdk-python/1.0.0 +https://github.com/devopness/devopness (python/3.13.0 Linux)
```
