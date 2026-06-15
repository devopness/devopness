---
title: View an Application
links:
  overview:
  quickstart:
  previous: applications/list-applications
  next: applications/edit-application
  guides:
  related:
  featured:
required_permissions:
  - application:read
---

Open one application to inspect its repository, deploy settings, and related resources.

## Goal

Check repository, pipeline, and deploy settings before you edit or deploy.

## What you need

- The correct project and environment selected
- Permission to read applications
- The application name or list entry you want to open

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Show me the application `acme-api`"
- "Open the application details for the Staging app named `acme-web`"
- "Show the repository and deploy settings for `acme-web`"

## What you see

- Repository details and deploy configuration
- Tabs for pipelines, deployments, servers, files, variables, and virtual hosts
- Settings that control how the application is built and released

## Verify

- The details page shows the application you expected
- The repository and deploy settings match the current setup

## Common issues

- The application does not open: confirm you selected the correct environment
- Details look stale: reopen the page after saving related changes
- Related tabs are empty: confirm the application has the resources you expect

## What to do next

- [Edit the application](/docs/applications/edit-application) when settings need to change
- [Deploy the application](/docs/applications/deploy-application) when the configuration is ready
