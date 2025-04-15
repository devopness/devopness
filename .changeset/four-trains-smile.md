---
"@devopness/sdk-js": minor
---

## ⚠️ Breaking Change

### What changed?

All `<ResourceType>` services that were previously accessed through the `EnvironmentService` (such as `applications`) have been moved to their respective standalone services (e.g., `ApplicationService`). Properties like `application` no longer exist in `EnvironmentService`.

### Why was this change made?

This refactor simplifies the SDK structure by consolidating all `<ResourceType>` methods into their respective services. It eliminates redundancy, improves maintainability, and makes the SDK more intuitive and aligned with common API design principles.

### Previous usage example

Previously, creating an application required accessing the method through `environment.application`:

```ts
const apiClient = new DevopnessApiClient();
const options = await apiClient.environment.application.addEnvironmentApplication();
```

### New usage example

Now, all application-related methods are available directly under `application`:

```ts
const apiClient = new DevopnessApiClient();
const options = await apiClient.application.addEnvironmentApplication();
```

### Impact & Migration Guide

Update all references that use `environment.<resourceType>` to the new direct service call format.
For example:

```ts
// Before
apiClient.environment.application.listEnvironmentApplications();

// After
apiClient.application.listEnvironmentApplications();
```

Repeat this migration for all affected `<ResourceType>` services.
