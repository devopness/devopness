---
"@devopness/sdk-python": minor
---

Added a method to list all memberships (links) of a given team, showing which environments the team has access to and the corresponding roles.

### Example Usage

```python
from devopness import DevopnessClient

devopness = DevopnessClient()

team_id = 123
response = devopness.teams.list_team_memberships(team_id)

for membership in response.data:
    print(f"Access to environment {membership.environment.name} with role {membership.role.name}")
```
