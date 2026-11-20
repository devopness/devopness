---
"@devopness/sdk-python": patch
---

Fixed incoming hook triggers so you can send the payload that should reach the hook.

```python
from devopness import DevopnessClient

devopness = DevopnessClient()

devopness.hooks.trigger_hook(
    hook_id,
    {
        "event_id": 123,
        "title": "Fix login flow",
    },
)
```
