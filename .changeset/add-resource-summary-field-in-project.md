---
"@devopness/sdk-js": minor
---

🚨 Breaking Changes

- Removed: environments, teams, and roles fields from the Project model.

🔄 Changes

- Added: resource_summary field to the Project model.

📌 Reason for Changes

The resource_summary field centralizes summary information about linked resources (environments, teams, and roles) within a project.

Each resource in resource_summary is an object containing:

- resource_type: Identifies the resource type.
- resource_type_plural: Identifies the resource type in plural form.
- resource_type_human_readable: Identifies the resource type in human readable form.
- resource_type_plural_human_readable: Identifies the resource type in plural form in human readable form.
- summary.count: Represents the number of linked resources.

To retrieve full lists of environments, teams, or roles, use the appropriate SDK methods instead of relying on the Project model.

If the goal is to determine the number of linked resources, use:

```ruby
  project
    .resource_summary
    .{resource-type}
    .summary
    .count
```
