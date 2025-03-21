---
"@devopness/sdk-js": minor
---

🚨 Breaking Changes

- Removed the direct *team_memberships* relation from EnvironmentRelation and ArchivedEnvironmentRelation.

🔄 Changes

- Added the *resource_summary* field to the EnvironmentRelation and ArchivedEnvironmentRelation.

📌 Reason for Changes

The *resource_summary* field centralizes summary information about linked resources, replacing explicit relations with a standardized summary format.

To retrieve a full list of team memberships, use the appropriate SDK method.

If you need to determine the number of linked team memberships, use:

```ruby
  environment
    .resource_summary['team-membership']
      .summary
      .count
  ```
