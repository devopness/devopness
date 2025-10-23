---
"@devopness/sdk-js": minor
---

Added a method to list all memberships (links) of a given team, showing which environments the team has access to and the corresponding roles.

### Example Usage

```javascript
import { DevopnessApiClient } from '@devopness/sdk-js';

const devopness = new DevopnessApiClient();

const teamId = 123;
const response = devopness.teams.memberships.listTeamMemberships(teamId);

for (const membership of response.data) {
    console.log(`Access to environment ${membership.environment.name} with role ${membership.role.name}`);
}
```
