---
"@devopness/sdk-js": minor
---

🔄 Changes

- Added: resource_summary field to the ProjectRelation model.

📌 Reason for Changes

The resource_summary field provides a structured summary of linked resources (environments, teams, and roles) within a project relation.

This ensures efficient access to resource counts without exposing full lists.

Each entry in resource_summary includes:

- resource_type: The singular identifier of the resource.
- resource_type_plural: The plural form of the resource type.
- resource_type_human_readable: A user-friendly singular name.
- resource_type_plural_human_readable: A user-friendly plural name.
- summary.count: The number of linked resources.

For resource counts, use:

```ruby
  projectRelation
    .resource_summary
    .{resource-type}
    .summary
    .count
```
