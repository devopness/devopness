---
"@devopness/sdk-js": patch
---

Introduced support for authentication via **API Tokens** in `DevopnessApiClient` configuration.  

Now you can provide an `apiToken` when creating the client, and also get/set it dynamically at runtime, enabling flexible token management (e.g., switching between a **Personal Access Token** and a **Project API Token**).

**Example:**

```javascript
import { DevopnessApiClient, SdkModels } from "@devopness/sdk-js";

const devopness = new DevopnessApiClient({
  apiToken: "devopness_pat_<rest_of_the_token>",
});

// Example: use Personal Access Token to list projects
const project = await devopness.projects.listProjects().then((res) => res.data[0]);
const role = await devopness.projects.roles.listProjectRoles(project.id).then((res) => res.data[0]);

// Create a new Project API Token
const projectToken = await devopness.apiTokens.addProjectApiToken(project.id, {
    name: "My Project Token",
    expires_in: SdkModels.ApiTokenAllowedExpiration._7Days,
    role_id: role.id,
});

// Switch to the new token at runtime
devopness.apiToken = projectToken.data.token;
