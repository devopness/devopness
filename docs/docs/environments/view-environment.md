---
title: View Environment
links:
  overview:
  quickstart:
  previous: environments/list-environments
  next: environments/add-environment
  guides:
    - environments/list-environments
    - environments/add-environment
    - environments/archive-environment
    - environments/find-archived-environment
  featured:
---

Open one environment to inspect its resources, settings, and access.

## Goal

Check what is configured before you deploy, edit settings, or add resources.

## What you need

- The correct project selected
- Permission to read the environment
- The environment name or list entry you want to open

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Show me the Production environment in `acme-platform`"
- "Open the Staging environment details"
- "List resources in my current environment"

## What you see

- A summary of resources in the environment
- Team memberships and settings
- Actions such as archive, unarchive, or remove

## Verify

- The details page shows the environment you expected
- Resources and settings match the current setup

## Common issues

- Missing resources on the page: add resources first
- You cannot edit settings: your role may be read-only for this environment

## What to do next

- [Add an environment](/docs/environments/add-environment) when you need another setup
- [Add applications](/docs/applications/add-application) in this environment
- [Archive an environment](/docs/environments/archive-environment) when you want to pause it
