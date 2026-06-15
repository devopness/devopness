---
title: List Team Memberships
links:
  overview: environments/team-memberships/index
  quickstart:
  previous: environments/team-memberships/index
  next: environments/team-memberships/add-team-membership
  guides:
    - environments/team-memberships/add-team-membership
    - environments/team-memberships/index
  featured:
---

List teams that have access to one environment and the role each team has.

## Goal

Check current team access before you add or change memberships.

## What you need

- Access to the target environment
- Permission to view environment memberships

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "List team memberships in the Production environment"
- "Show which teams have access to Staging in `acme-platform`"

## What you see

- Each team linked to the environment
- The role assigned to each team

## Verify

- The list shows the teams and roles you expected
- Permissions match what you need for this environment

## Common issues

- List is empty: confirm teams and roles exist in the organization
- You cannot open the list: check environment permissions

## What to do next

- [Add a team membership](/docs/environments/team-memberships/add-team-membership)
