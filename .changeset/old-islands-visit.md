---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

## Changes
- Added a dedicated method to create projects under an organization: `devopnessClient.projects.addOrganizationProject`
- Removed the `organization_id` parameter from `devopnessClient.projects.addProject`, as organization-specific project creation is now handled by the new method.
