---
"@devopness/sdk-python": minor
---

Migrate team and role management to organization-based architecture

## New Features

### Organization-level team management

- `add_organization_team(organization_id, data)` - Create team at organization level
- `list_organization_teams(organization_id)` - List all teams in an organization
- `list_organization_team_memberships(organization_id)` - List team memberships in organization
- `link_team_to_organization(organization_id, team_id, data)` - Link team to organization with role
- `unlink_team_from_organization(organization_id, team_id)` - Remove team from organization

### Enhanced team linking

- `link_team_to_project(project_id, team_id, data)` - Link team to project with role
- `unlink_team_from_project(project_id, team_id)` - Remove team from project
- `list_project_team_memberships(project_id)` - List team memberships in project
- `list_team_memberships(team_id)` - List all memberships of a specific team

### Organization-level role management

- `add_organization_role(organization_id, data)` - Create custom role at organization level
- `list_organization_roles(organization_id)` - List all roles in an organization
