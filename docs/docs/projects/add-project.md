---
title: Add a Project
links:
  overview:
  quickstart:
  previous: organizations/add-organization
  next: environments/add-environment
  guides:
    - projects/list-projects
  featured:
---

Create a project inside your organization for one product or client.

## Goal

Add the project before you create environments, teams, or applications.

## Prerequisites

- You can create projects in the selected organization
- The correct organization is selected

## What you need

### Name

A name your team will recognize, such as the product or client name.
This is how the project appears in lists and navigation.

Examples: `acme-platform`, `northwind-portal`, `design-studio`

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme`, create a project named `acme-platform`"
- "Add a new project called `northwind` for my client"
- "List projects in `/@acme`, then create a project for internal tooling"

## After you save

- The project appears in your project list for that organization
- You can add environments, teams, roles, and applications inside it

## Verify

- The project appears with the expected name in the correct organization
- You can open it and continue with environments or team setup

## What to consider

### One project per product or client

Use separate projects when products or clients need separate owners, permissions, or release schedules.

Use separate **environments** inside one project when you need dev, staging, and production infrastructure for the same product.

## Common issues

- You do not see `Add Project`: confirm you have permission to create projects in this organization
- The organization selected is not the one you intended: switch organization before you save
- The project name is already taken or invalid: choose a unique name

## What to do next

- [Add an environment](/docs/environments/add-environment)
- [List projects](/docs/projects/list-projects) to confirm it appears
