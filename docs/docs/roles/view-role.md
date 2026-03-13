---
title: Check a Role's Permissions
links:
  overview: roles/index
  quickstart:
  previous: roles/list-roles
  next:
  guides:
    - roles/list-roles
    - roles/add-role
  featured:
---

Inspect what a role can do before assigning it to a team.

## Goal

Understand the exact permissions a role grants in an environment.

## Who should use this

- Team owners reviewing security impact
- Environment admins choosing a safe access level

## You need

- Permission to view role definitions

## Steps

1. Open the organization and go to `Roles`
2. Select the role you want to verify
3. Review each permission group and action in the role details
4. Confirm it matches the access you expect before using it in memberships

## Expected result

- You can decide whether the role is safe for the target environment
- You can avoid giving teams more access than needed

## Common issues

- You cannot see permissions: confirm organization-level read access
- Permission list is unclear: reopen from list to view the latest definition

## Next

- Update access by assigning roles through [Team Memberships](/docs/environments/team-memberships)
