---
title: Remove an Environment
links:
  overview:
  quickstart:
  previous: environments/view-environment
  next: environments/list-environments
  guides:
    - environments/list-environments
    - environments/archive-environment
  related:
  featured:
---

Delete an environment when you no longer need that separate infrastructure setup.

## Goal

Remove an unused environment after your release flow changes.

:::warning
Removing this environment is permanent. Confirm this environment is no longer needed before you continue.
:::

Removed environments no longer keep an active deployment target.

## Prerequisites

- Permission to edit and remove environments
- A target environment that is safe to delete
- No active resources still depend on it

## What you need

- The environment you want to remove
- Confirmation that deletion is intentional

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Remove the `hotfix-2024` environment from `acme-platform`"
- "Delete the unused Staging environment in my project"

Check the environment name before you confirm deletion.

## Verify

- The environment no longer appears in the environment list
- Remaining environments still work as expected

## Common issues

- Remove is disabled: check if there are active resources still linked to the environment
- You do not have permission to remove this environment: ask a project owner for access
- You need one environment for current workload: remove only after creating a replacement

## What to do next

- [List environments](/docs/environments/list-environments)
- [Archive an environment](/docs/environments/archive-environment) when you want to keep history instead of deleting
