---
title: Remove a File
links:
  overview:
  quickstart:
  previous: applications/add-application
  next: files/add-file
  guides:
  related:
  featured:
required_permissions:
  - application:update
---

Remove a configuration file from an application when it is no longer needed, such as a `.env` whose settings are obsolete.

## Goal

Delete a configuration file so the application no longer loads its settings on the next deploy.

## Prerequisites

- You can update applications in this environment (`application:update`)
- The configuration file you want to remove exists

## What you need

### Application

The application whose configuration file you want to remove.

### File

The configuration file to delete. Confirm the file is no longer needed before you remove it, because the removal is permanent.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme-inc`, project `acme-platform`, remove the `.env` file from the `acme-api` application in the Production environment."
- "In organization `acme-inc`, project `acme-platform`, delete the obsolete `config.yaml` file of `acme-web` in Staging."

## After you remove

- A new deployment is required for your changes to take effect. [Deploy the application](/docs/applications/deploy-application) so the application stops loading the removed settings

## Verify

- The file no longer appears in the application's configuration file list
- A new deploy of the application no longer loads that file's settings

## Common issues

### The application still uses the removed settings

- Confirm the file is gone from the configuration file list
- [Deploy](/docs/applications/deploy-application) again, because removal takes effect on deploy
- Check whether the value is set elsewhere, such as in the repository or another file

### You do not see Remove

- Confirm you have `application:update` for this environment

## What to do next

- [Add a File](/docs/files/add-file) if you need to replace the removed configuration
- [Deploy Application](/docs/applications/deploy-application) to apply the change
