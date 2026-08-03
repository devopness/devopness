---
title: Add a File
links:
  overview:
  quickstart:
  previous: applications/add-application
  next: applications/deploy-application
  guides:
  related:
    - files/view-file
    - files/edit-file
  featured:
required_permissions:
  - application:update
---

Add a configuration file to an application so Devopness uses its settings during deploy, without hard-coding them into your code.

Common examples are a `.env` file with environment variables, or app-specific config that should not live in the repository.

## Goal

Store configuration settings and environment variables for an application before you deploy it.

## Prerequisites

- You can update applications in this environment (`application:update`)
- The application already exists in the selected environment

## What you need

### Application

The application that should load this configuration file during deploy.

### File name

The name of the file, for example `.env`. Make sure the file is where your application and its packages expect to read it.

### File content

The settings and environment variables the application needs at runtime, one per line, for example:

```text
DATABASE_URL=postgres://user:pass@host:5432/acme
API_KEY=your-api-key
```

Use the same key names your application reads so it picks up the values on the next deploy.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In project `acme-platform`, add a `.env` file to the `acme-api` application in the Production environment with `DATABASE_URL` and `API_KEY`."
- "In project `acme-platform`, create a configuration file `config.yaml` for `acme-web` in Staging and set environment variables from this list."

## After you save

- A new deployment is required for your changes to take effect. [Deploy the application](/docs/applications/deploy-application) so the settings are applied

## Verify

- The file appears in the application's configuration file list with the expected name, path, and content
- A new deploy of the application picks up the values you set

## Common issues

### Settings have no effect after deploy

- Confirm the file name and path match what your application reads
- Confirm the key names match the ones your application expects
- [Deploy](/docs/applications/deploy-application) again after saving the file, because changes take effect on deploy

### You do not see Add File

- Confirm you have `application:update` for this environment

## What to do next

- [Deploy Application](/docs/applications/deploy-application) to apply the configuration
- [View a File](/docs/files/view-file) to review the file you added
