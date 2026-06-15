---
title: Unarchive an Environment
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
    - environments/find-archived-environment
  featured:
---

Restore an archived environment so you can deploy and change it again.

## Goal

Bring a paused environment back to active use.

## Prerequisites

- Permission to unarchive environments
- An environment currently in archived state

## What you need

- The archived environment you want to restore

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Unarchive the `legacy-staging` environment in `acme-platform`"
- "Restore the archived hotfix environment in my project"

## After you save

- The environment becomes active again
- Team members can access it based on current roles

## Verify

- The environment appears in the active environment list
- You can deploy and edit resources again

## Common issues

- Unarchive is disabled: confirm the environment is truly archived
- You do not have permission to unarchive this environment

## What to do next

- [View the environment](/docs/environments/view-environment)
- [List environments](/docs/environments/list-environments)
