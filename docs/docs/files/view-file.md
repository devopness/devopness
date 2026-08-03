---
title: View a File
links:
  overview:
  quickstart:
  previous: files/edit-file
  next: files/remove-file
  guides:
  related:
    - files/add-file
    - files/edit-file
  featured:
required_permissions:
  - application:read
---

View the details of a configuration file attached to an application, including its name, path, content, and metadata.

Use this page to confirm what an application loads at runtime, for example credentials and environment variables.

## Goal

Review an application's configuration file and the settings it provides.

## What you see

- The file's **name** and **path** within the application or repository
- The file's **content**, such as the environment variables in a `.env`
- When the file was **created** and **last updated**

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme-inc`, project `acme-platform`, show the `.env` file content of `acme-api` in the Production environment."
- "In organization `acme-inc`, project `acme-platform`, list the configuration files of `acme-web` in Staging and show the one named `config.yaml`."

## Verify

- You can read the expected file name, path, and content
- The settings shown match what the application should load

## Common issues

### The file content looks incomplete

- Confirm you are viewing the right file and application
- [Edit the File](/docs/files/edit-file) if a value is missing or wrong, then deploy again

## What to do next

- [Edit a File](/docs/files/edit-file) to change the settings
- [Remove a File](/docs/files/remove-file) when the file is no longer needed
