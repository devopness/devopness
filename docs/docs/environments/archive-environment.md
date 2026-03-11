---
title: Archive an Environment
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
    related:
  featured:
---

Pause an environment and keep all setup and history.

## Goal

Keep historical environments visible while preventing active changes.

## Who should use this

- Project owners with many environments
- Teams freezing old release flows

## You need

- Permission to archive environments
- The target environment to archive

## Steps

1. Go to the project and choose the environment to pause
2. Open environment settings
3. Go to `Archived environments`
4. Confirm archive

## Expected result

- The environment becomes read-only
- Settings, history, and team memberships remain preserved

## Common issues

- You cannot archive: check for resources that still need manual cleanup
- You do not have permission to archive this environment

:::note
Archiving does not remove cloud resources.
Remove unused resources before archive to avoid extra cost.
:::

:::note
Archived environments are read-only.
Only project owners can restore them.
:::
