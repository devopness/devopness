---
"@devopness/sdk-python": minor
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

```python
from devopness import DevopnessClient

devopness = DevopnessClient()

# Old multi-step approach
pipelines = devopness.pipelines.list_resource_pipelines(
    environment_id,
    resource_type,
    resource_id
)

deploy_pipeline = next(p for p in pipelines.data if p.type == "deploy")

devopness.actions.trigger_pipeline_action(deploy_pipeline.id, {
    "servers": [server_id]
})
```

**After:**

```python
from devopness import DevopnessClient

devopness = DevopnessClient()

# New simplified approach
devopness.cron_jobs.deploy_cron_job(cron_job_id, {
    "servers": [server_id]
})

# Other examples:
devopness.daemons.deploy_daemon(daemon_id, {"servers": [server_id]})
devopness.services.deploy_service(service_id, {"servers": [server_id]})
devopness.ssh_keys.deploy_ssh_key(ssh_key_id, {"servers": [server_id]})
```

### Impact

If you were programmatically listing or managing deploy pipelines for these resources, you must migrate to the new deployment methods.

The deploy pipeline will no longer appear in pipeline listings for these resource types.
