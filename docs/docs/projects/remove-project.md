---
title: Remove a Project
links:
  overview:
  quickstart:
  previous: projects/edit-project
  next: projects/list-projects
  guides:
    - projects/list-projects
    - projects/index
  related:
  featured:
---

Delete a project when you no longer need it.

:::warning
Removing a project is permanent. This action cannot be undone.
:::

This also removes all environments, applications, and related resources inside the project.

## Goal

Delete the project and stop managing it in Devopness.

## Prerequisites

- You can delete projects in the selected organization
- Team members who use this project know it will be deleted
- You saved or moved any data you still need outside Devopness

## What you need

- The project you want to remove
- Confirmation that deletion is intentional

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Remove project `old-demo` from organization `acme`"
- "Delete the `northwind-staging` project after confirming it is unused"

Check the project name carefully before you confirm deletion.

## Verify

- The project no longer appears in the [project list](/docs/projects/list-projects)
- Team access to that project is removed
- Environments and applications in that project are no longer available in Devopness

## Common issues

- You cannot remove the project: confirm you have delete permission for the project
- Deletion is blocked: remove or archive dependent resources first if required
- You deleted the wrong project: this cannot be undone; restore from backups outside Devopness if needed

## What to do next

- [List projects](/docs/projects/list-projects) to see remaining projects
- [Add a project](/docs/projects/add-project) when you need a new one
