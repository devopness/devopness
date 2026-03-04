---
"@devopness/sdk-js": minor
---

Migrate team and role management to organization-based architecture

## ⚠️ Breaking Changes

### Removed nested service APIs

Team and role management methods have been moved from nested service paths to the main `teams` and `roles` services:

**Removed:**

- `devopness.projects.roles.*` → Use `devopness.roles.*`
- `devopness.projects.teams.*` → Use `devopness.teams.*`
- `devopness.environments.teams.*` → Use `devopness.teams.*`
- `devopness.environments.teamMemberships.*` → Use `devopness.teams.*`
- `devopness.teams.memberships.*` → Use `devopness.teams.*`

### Migration Examples

**Before:**

```javascript
// Linking team to environment
await devopness.environments.teams.linkTeamToEnvironment(envId, teamId, data);

// Listing environment team memberships
await devopness.environments.teamMemberships.listEnvironmentTeamMemberships(envId);

// Managing project roles
await devopness.projects.roles.addProjectRole(projectId, roleData);
```

**After:**

```javascript
// All team operations now in teams service
await devopness.teams.linkTeamToEnvironment(envId, teamId, data);

await devopness.teams.listEnvironmentTeamMemberships(envId);

// Roles now organization-based
await devopness.roles.addOrganizationRole(organizationId, roleData);
```

## New Features

### Organization-level team management

- `addOrganizationTeam(organizationId, data)` - Create team at organization level
- `listOrganizationTeams(organizationId)` - List all teams in an organization
- `listOrganizationTeamMemberships(organizationId)` - List team memberships in organization
- `linkTeamToOrganization(organizationId, teamId, data)` - Link team to organization with role
- `unlinkTeamFromOrganization(organizationId, teamId)` - Remove team from organization

### Enhanced team linking

- `linkTeamToProject(projectId, teamId, data)` - Link team to project with role
- `unlinkTeamFromProject(projectId, teamId)` - Remove team from project
- `listProjectTeamMemberships(projectId)` - List team memberships in project
- `listTeamMemberships(teamId)` - List all memberships of a specific team

### Organization-level role management

- `addOrganizationRole(organizationId, data)` - Create custom role at organization level
- `listOrganizationRoles(organizationId)` - List all roles in an organization

## Impact

If you were using nested service paths for team or role management, you must update your code to use the new flat service structure. All team operations are now consolidated under `devopness.teams.*` and roles under `devopness.roles.*`.
