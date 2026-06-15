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

List applications in one environment.

## Goal

See which applications exist in the selected project and environment.

## What you need

- The correct project and environment selected
- Permission to read applications

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "List the applications in the Production environment of `acme-platform`"
- "Show applications named `api` in Staging"
- "List the applications in my current environment"

## What you see

- Application names you can open
- Search by name when the list is long

## Verify

- The list shows the environment you expected
- The application names match what you need to manage

## Common issues

- The list is empty: confirm you selected the correct environment
- An application is missing: confirm you have read access to that environment
- Search returns no results: check the application name or switch environments

## What to do next

- [View an application](/docs/applications/view-application)
- [Deploy an application](/docs/applications/deploy-application)
