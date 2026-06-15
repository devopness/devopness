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

Review the application details before you edit, link, or deploy it.

## What you need

- The correct project and environment selected
- Permission to read applications
- The application name or list entry you want to open

## Using Devopness MCP

If you use Devopness from your IDE or an AI agent, try prompts like:

- "Show me the application `acme-api`"
- "Open the application details for the current Staging app"
- "Display the repository and deploy settings for `acme-web`"

## What you see

- Repository details and deploy configuration
- Related tabs such as pipelines, deployments, servers, files, variables, and virtual hosts
- The current settings that control how the application is built and released
- If you change files or variables, use the related tabs to review what will be deployed next

## Verify

- The details page shows the application you expected
- The repository and deploy settings match the current setup

## Common issues

- The application does not open: confirm you selected the correct environment
- Details look stale: reopen the page after saving related changes
- Related tabs are empty: confirm the application has the resources you expect

## What to do next

- Edit the application if the settings need to change
- [Deploy the application](/docs/applications/deploy-application) if the current configuration is ready
