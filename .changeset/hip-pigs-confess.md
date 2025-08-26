---
"@devopness/sdk-python": patch
---

Introduced support for authentication via **API Tokens** in `DevopnessClient` configuration.  

Now you can provide an `api_token` when creating the client, and also get/set it dynamically at runtime, enabling flexible token management (e.g., switching between a **Personal Access Token** and a **Project API Token**).

**Example:**

```python
from devopness import DevopnessClient

devopness = DevopnessClient(
    {
        "api_token": "devopness_proj_<rest_of_the_token>",
        "auto_refresh_token": False,
    }
)

# Example: use Project API Token to list environments
project_id = 123
list_environments = devopness.environments.list_project_environments(project_id)

# Switch to a Personal Access Token at runtime
devopness.api_token = "devopness_pat_<rest_of_personal_access_token>"

# Perform an action as the user
me = devopness.users.get_user_me()
```
