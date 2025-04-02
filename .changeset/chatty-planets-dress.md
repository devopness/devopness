---
"@devopness/sdk-js": minor
---

## ⚠️ Breaking Change

### What changed?

All static data services have been consolidated into `StaticService`, removing individual static service properties like `applicationOptions`.

### Why was this change made?

This refactor simplifies the SDK structure by consolidating all static data retrieval methods into a single service. This reduces redundancy, improves maintainability, and ensures a more intuitive API design.

### How was it used before?

Previously, retrieving static data required calling specific static services, such as:

```ts
const apiClient = new DevopnessApiClient();
const options =
  await apiClient.static.applicationOptions.getStaticApplicationOptions();
```

### How should it be used now?

Now, all static data methods are centralized under `StaticService`:

```ts
const apiClient = new DevopnessApiClient();
const options = await apiClient.static.getStaticApplicationOptions();
```

### Impact & Migration

Replace all occurrences of static service calls, e.g., `static.applicationOptions.getStaticApplicationOptions()` with `static.getStaticApplicationOptions()`.
