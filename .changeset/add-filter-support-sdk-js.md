---
"@devopness/sdk-js": minor
---

Added support for `filter` query parameters in list endpoints for **Actions** and **Environment Actions**.

### Example Usage

```javascript
const actions = await devopness.actions.listActions(
  /* page */
  1,
  /* perPage */
  20,
  {
    organization_id: 123,
    project_id: 456,
    status: "queued",
  }
);

const environmentActions = await devopness.environmentsActions.listEnvironmentActions(
  /* environmentId */
  environmentId,
  /* page */
  1,
  /* perPage */
  20,
  {
    resource_type: "application",
    resource_id: 321,
    status: "completed",
  }
);
```

If the filter object is omitted, the methods keep their previous behavior and return the unfiltered list.
