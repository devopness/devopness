---
"@devopness/sdk-js": patch
---

Added Search, which lets you find resources you can access by name inside a specific organization.

Configure your API token and organization slug, then try this right away:

```ts
import { DevopnessApiClient } from "@devopness/sdk-js";

const devopness = new DevopnessApiClient({
  apiToken: "your-api-token",
});

const results = await devopness.search.listSearchResources(
  "your-organization-slug",
  "app",
  "application",
);
```
