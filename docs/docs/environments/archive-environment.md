---
title: Archive an Environment
links:
  overview:
  quickstart:
  previous:
  next:
  guides: []
  featured:
---

Archive an environment to make it read-only while keeping its setup and history.

## Goal

Pause an old release flow without deleting its configuration.

## Prerequisites

- Permission to archive environments
- The target environment to archive

## What you need

- The environment you want to archive
- Confirmation that active changes should stop in this environment

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Archive the `legacy-staging` environment in `acme-platform`"
- "Archive the old hotfix environment in my project"

## After you save

- The environment becomes read-only
- Settings, history, and team memberships stay in place

## Verify

- The environment appears in the archived list
- You cannot make active changes in it

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

## What to do next

- [Find an archived environment](/docs/environments/find-archived-environment)
- [Unarchive an environment](/docs/environments/unarchive-environment) when you need it active again
