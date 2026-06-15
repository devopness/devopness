---
title: Remove an Organization
links:
  overview:
  quickstart:
  previous: organizations/edit-organization
  next: organizations/index
  guides: []
  featured:
---

Delete an organization when you no longer need its projects, teams, or resources.

:::warning
Removing an organization is permanent. This action cannot be undone.
:::

## Goal

Delete the organization and remove its data from Devopness.

## Prerequisites

- Permission to delete organizations
- Required data is backed up or migrated
- No active resources still depend on it

## What you need

- The organization you want to remove
- Confirmation that deletion is intentional

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Remove the organization `acme-old` after migrating its projects"
- "Delete the client organization `northwind`"

Check the organization name before you confirm deletion.

## Verify

- The organization is gone from the organization list
- No active project or team still points to it

## Common issues

- You cannot remove the organization: confirm required data is archived first
- Deletion is blocked: confirm you have delete permission for this organization
- You need to delete dependent resources first: check for active projects, tokens, or integrations

## What to do next

- [Organizations](/docs/organizations/) overview
- [Add an organization](/docs/organizations/add-organization) when you need a new one
