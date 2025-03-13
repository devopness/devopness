---
"@devopness/sdk-js": minor
---

🚨 Breaking Changes

- Removed: Direct resource relation fields from the Environment model:
  - applications
  - credentials
  - cron_jobs
  - daemons
  - network_rules
  - networks
  - servers
  - services
  - ssh_keys
  - ssl_certificates
  - virtual_hosts

🔄 Changes

- Added: resource_summary field to the Environment model.

📌 Reason for Changes

The resource_summary field centralizes summary information about linked resources, replacing explicit relations with a standardized summary format.

This change enhances efficiency by reducing response payload size while still providing resource count details.

Each entry in resource_summary includes:

- resource_type: The singular identifier of the resource.
- resource_type_plural: The plural form of the resource type.
- resource_type_human_readable: A user-friendly singular name.
- resource_type_plural_human_readable: A user-friendly plural name.
- summary.count: The number of linked resources.

To retrieve full resource lists, use the appropriate SDK methods instead of relying on the Environment model.

If the goal is to determine the number of linked resources, use:

```ruby
  environment
    .resource_summary
    .{resource-type}
    .summary
    .count
```
