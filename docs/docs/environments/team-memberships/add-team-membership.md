---
title: Add a Team Membership
links:
  overview:
  quickstart:
  previous: environments/team-memberships/list-team-memberships
  next: environments/team-memberships/list-team-memberships
  guides: []
  featured:
---

Add a team to an environment with a role so all members of that team get the same access.

## Goal

Grant one team the same access to an environment through one role assignment.

## Prerequisites

- Team and role created in the organization
- Permission to manage team memberships

## What you need

### Team

The team that should get access to this environment.

### Role

The role that defines what that team can do in this environment.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Add the `backend` team to Production with the Developer role"
- "Grant the `ops` team access to Staging in `acme-platform`"

## After you save

- Members of the team can access the environment based on the role
- The new membership appears in the list

## Verify

- The team appears in the environment team memberships list
- The assigned role matches what you intended

## Common issues

- Role not sufficient: check role details and permissions
- Team not listed: verify the team exists in the organization

## What to do next

- [List team memberships](/docs/environments/team-memberships/list-team-memberships)
- [Teams](/docs/teams/) and [Roles](/docs/roles/)
