---
title: Edit a Project
links:
  overview:
  quickstart:
  previous: projects/view-project
  next: projects/remove-project
  guides:
    - projects/view-project
  related:
  featured:
---

Change a project's name or settings when the product, client, or team details change.

## Goal

Update project details without creating a new project.

## Prerequisites

- You can edit project settings in the selected organization
- The target project exists and you can open it

## What you need

### Name

The name for this product or client inside the organization.
Use a name your team will recognize in lists and navigation.

### Metadata and settings

Update the other project fields shown in the form when your team needs a change.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Rename project `acme-old` to `acme-platform` in organization `acme`"
- "Update the project settings for `northwind`"
- "Show project `design-studio` and update its name"

## After you save

- The project stays the same in Devopness; only the updated fields change
- Existing environments, teams, roles, and applications stay linked to this project

## Verify

- The project details show the updated name and settings
- Environments and applications inside the project are unchanged unless you edited them separately

## Common issues

- You do not see edit actions: confirm your role allows project updates
- A new project name conflicts with naming rules: choose a unique name in the organization
- Changes are not visible yet: reopen the project view after saving

## What to do next

- [View the project](/docs/projects/view-project) to confirm the updated setup
- [Deploy applications](/docs/applications/deploy-application) when you are ready to release again
