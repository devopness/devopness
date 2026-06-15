---
title: View a Project
links:
  overview:
  quickstart:
  previous: projects/list-projects
  next: projects/edit-project
  guides:
    - projects/list-projects
    - projects/add-project
  featured:
---

Review one project's environments, teams, roles, and API tokens.

## Goal

Check that the project has the environments and access you expect.

## What you need

- The correct organization selected
- Permission to view the project
- The project name or list entry you want to open

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Show details for project `acme-platform`"
- "List environments in project `northwind`"
- "What teams and roles are configured for `design-studio`?"

## What you see

- **Environments:** separate infrastructure setups inside the project (dev, staging, production)
- **Teams:** who can work in this project
- **Roles:** access rules for project members
- **API tokens:** tokens for this project when you use the API or MCP

## Verify

- You opened the project you intended
- Environments, teams, and roles match what you expect
- API tokens are listed when you need them for automation

## Common issues

- You cannot view project details: confirm your role in the selected organization
- An environment is missing: [add an environment](/docs/environments/add-environment)
- API tokens are missing: create tokens for this project when you need API or MCP access

## What to do next

- [Add an environment](/docs/environments/add-environment) when the project needs another infrastructure setup
- [Add an application](/docs/applications/add-application) inside an environment
- [Edit the project](/docs/projects/edit-project) when the name or settings need to change
