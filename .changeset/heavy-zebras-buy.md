---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

### Added
Added support for a new parameter `owner` in the `getProjects` method.
This parameter allows filtering projects by **owner ID** or **URL slug** (user or organization).

If the parameter is omitted, the method retains its previous behavior — returning **all projects accessible** by the authenticated user.

### Removed
Removed the `listOrganizationProjects` method, as its functionality is now covered by the `getProjects` method with the new `owner` filter.
