---
title: Edit a File
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
  related:
    - files/view-file
    - files/add-file
  featured:
required_permissions:
  - application:update
---

Update a configuration file so your application uses the latest settings and environment variables on its next deploy.

Edit a file when values change, such as a new database URL or API key, without hard-coding them into your code.

## Goal

Change the name or content of a configuration file attached to an application.

## Prerequisites

- You can update applications in this environment (`application:update`)
- The configuration file already exists for the application

## What you need

### Application

The application whose configuration file you want to update.

### File name and content

The new name or content for the file, for example a revised `.env`.
Keep the same key names your application reads so it picks up the updated values on the next deploy.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme-inc`, project `acme-platform`, update the `DATABASE_URL` in the `.env` file of `acme-api` in the Production environment."
- "In organization `acme-inc`, project `acme-platform`, rename the `config.yaml` file of `acme-web` in Staging and keep its current content."

## After you save

- A new deployment is required for your changes to take effect. [Deploy the application](/docs/applications/deploy-application) so the updated settings are applied

## Verify

- The file shows the new name and content in the application's configuration file list
- A new deploy of the application picks up the updated values

## Common issues

### New values have no effect after deploy

- Confirm the key names still match what your application reads
- Confirm you saved before deploying again
- [Deploy](/docs/applications/deploy-application) again after saving, because changes take effect on deploy

### You do not see Edit

- Confirm you have `application:update` for this environment

## What to do next

- [View a File](/docs/files/view-file) to confirm the updated settings
- [Deploy Application](/docs/applications/deploy-application) to apply the configuration
