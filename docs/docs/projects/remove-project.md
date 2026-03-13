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

## Goal

Stop managing a project and remove it from your setup.

:::warning
Removing a project is permanent. This action cannot be undone.
:::

Deleting a project removes project resources (including all its environments) and cannot be undone.

## Who should use this

- Project owners
- Organization owners with permission to delete project resources

## You need

- Permission to remove projects
- Confirmation that team members are aware of the deletion

## Steps

1. Go to the project you want to remove
2. Go to `Project Settings`
3. Select `Remove Project`
4. Confirm the removal in the final dialog

## Result

- The project disappears from the project list
- Team access to that project is revoked

## Common issues

- You cannot remove the project: check if you have delete permission for the project
- Environments are still active: remove or archive them first
- You do not have permission to remove resources in this organization

## Next

- Check remaining projects in [`List Projects`](/docs/projects/list-projects)
