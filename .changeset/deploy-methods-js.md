---
"@devopness/sdk-js": minor
---

## ⚠️ Breaking Change

### Simplified deployment workflow for multiple resource types

Previously, deploying resources required a multi-step process: listing pipelines, finding the deploy pipeline, and triggering an action. Now, dedicated `deploy()` methods provide direct deployment capabilities.

**Affected resources:**

- Cron Jobs
- Daemons
- Network Rules
- Servers
- Services
- SSH Keys
- SSL Certificates
- Virtual Hosts

### What Changed

The deploy pipeline is no longer visible or accessible through the pipelines API for these resources. Instead, use the new dedicated deployment methods.

### Migration Example

**Before:**

```javascript
import { DevopnessApiClient } from "@devopness/sdk-js";

const devopness = new DevopnessApiClient();

// Old multi-step approach
const pipelines = await devopness.pipelines.listResourcePipelines(
  environmentId,
  resourceType,
  resourceId
);

const deployPipeline = pipelines.data.find(p => p.type === "deploy");

await devopness.actions.triggerPipelineAction(deployPipeline.id, {
  servers: [serverId]
});
```

**After:**

```javascript
import { DevopnessApiClient } from "@devopness/sdk-js";

const devopness = new DevopnessApiClient();

// New simplified approach
await devopness.cronJobs.deployCronJob(cronJobId, {
  servers: [serverId]
});

// Other examples:
await devopness.daemons.deployDaemon(daemonId, { servers: [serverId] });
await devopness.services.deployService(serviceId, { servers: [serverId] });
await devopness.sshKeys.deploySshKey(sshKeyId, { servers: [serverId] });
```

### Impact

If you were programmatically listing or managing deploy pipelines for these resources, you must migrate to the new deployment methods.

The deploy pipeline will no longer appear in pipeline listings for these resource types.
