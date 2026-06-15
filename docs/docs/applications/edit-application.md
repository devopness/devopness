---
title: Edit an Application
links:
  overview:
  quickstart:
  previous: applications/list-applications
  next: applications/view-application
  guides:
  related:
  featured:
required_permissions:
  - application:update
---

Change an application's repository, build settings, or branch when the source or deploy setup changes.

## Goal

Update application settings without creating a new application.

## Prerequisites

- You can edit applications in this environment (`application:update`)
- The project and environment are already selected
- The application exists in that environment

## What you need

Change only the fields that need an update.

### Repository or source location

The git repository, or the folder inside a monorepo, that Devopness should build.

### Source provider and credential

The git host and credential that can read the source.

### Root directory

The folder that contains the package manager file for the application.
Use a subfolder when the source lives inside a monorepo.

### Default branch

The branch Devopness uses when a deploy does not specify another ref.

### Install dependencies command / Build command

Custom commands only when the defaults no longer match your stack.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Update the `acme-api` application to use the `main` branch"
- "Change the repository for `acme-web`"
- "Update the build command for the application in Staging"

## After you save

- The application stays the same in Devopness; only the updated fields change
- Existing linked resources stay attached unless you change them
- Deploy again if the changes affect runtime behavior

## Verify

- The application details show the updated settings
- The repository, root directory, and commands match the new source layout

## Common issues

- You cannot save changes: confirm you still have edit permission
- A field validation error appears: check the updated repository path or command text
- The application still uses the old settings: confirm you saved the change in the correct environment

## What to do next

- [View the application](/docs/applications/view-application)
- [Deploy the application](/docs/applications/deploy-application) when the change affects runtime behavior
