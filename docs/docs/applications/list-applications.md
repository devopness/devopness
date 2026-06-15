---
title: List Applications
links:
  overview:
  quickstart:
  previous: applications/index
  next: applications/view-application
  guides:
  related:
  featured:
required_permissions:
  - application:read
---

Find the applications in one environment so you can open details, deploy one, or inspect its related resources.

## Goal

Show the applications that belong to the selected project and environment.

## What you need

- The correct project and environment selected
- Permission to read applications

## Using Devopness MCP

If you use Devopness from your IDE or an AI agent, try prompts like:

- "List the applications in the Production environment of `acme-platform`"
- "Show applications named `api` in Staging"
- "List the applications in my current environment"

## What you see

- Each application row shows the name you can open
- Search helps you narrow the list by name
- Opening a row takes you to application details and related tabs

## Verify

- The list shows the environment you expected
- The application names match the resources you want to manage

## Common issues

- The list is empty: confirm you selected the correct environment
- An application is missing: confirm you have read access to that environment
- Search returns no results: check the application name or switch environments

## What to do next

- Open an application to review its details
- [Deploy the application](/docs/applications/deploy-application) when you are ready to release changes
