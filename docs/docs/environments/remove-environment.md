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

Delete an environment when you no longer need that deployment stage.

## Goal

Clean up old stages and stop working from it after deployment flow changes.

:::warning
Removing this environment is permanent. Confirm this stage is no longer needed before you continue.
:::

Removed environments no longer keep an active deployment target.

## Who should use this

- Project owners
- Team members with environment delete permission

## You need

- Permission to edit and remove environments
- A target environment that is safe to delete

## Steps

1. Go to the environment you want to remove
2. Go to environment settings
3. Select `Remove Environment`
4. Confirm removal

## Result

- The environment no longer appears in the environment list
- The environment is no longer deployable until it is recreated

## Common issues

- Remove is disabled: check if there are active resources still linked to the environment
- You do not have permission to remove this environment: ask a project owner for access
- You need one environment for current workload: remove only after creating a replacement

## Next

- Use [`List Environments`](/docs/environments/list-environments) to continue with the remaining stages
