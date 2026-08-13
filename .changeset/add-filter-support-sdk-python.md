---
"devopness": minor
---

Added support for `filter` query parameters in list endpoints for **Actions** and **Environment Actions**.

### Example Usage

```python
from devopness import DevopnessClient

devopness = DevopnessClient()

actions = devopness.actions.list_actions(
    page=1,
    per_page=20,
    filter={
        "organization_id": 123,
        "project_id": 456,
        "status": "queued",
    },
)

environment_actions = devopness.environments_actions.list_environment_actions(
    environment_id=environment_id,
    page=1,
    per_page=20,
    filter={
        "resource_type": "application",
        "resource_id": 321,
        "status": "completed",
    },
)
```

If the filter object is omitted, the methods keep their previous behavior and return the unfiltered list.
