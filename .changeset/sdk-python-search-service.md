---
"@devopness/sdk-python": patch
---

Added Search, which lets you find resources you can access by name inside a specific organization.

Configure your API token and organization slug, then try this right away:

```py
from devopness import DevopnessClient

devopness = DevopnessClient({
    "api_token": "your-api-token"
})

results = devopness.search.list_search_resources(
    "your-organization-slug",
    "app",
    "application",
)
```
