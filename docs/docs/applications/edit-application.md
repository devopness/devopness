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

Update an application when the source, build, or release settings changed.
Use this page to keep the application aligned with the repo, folder, branch, and commands used to build and run it.

## Goal

Keep the application configuration current after source, runtime, or deployment changes.

## Prerequisites

- You can edit applications in this environment (`application:update`)
- The project and environment are already selected
- The application exists in that environment

## What you need

Fill in only the fields that need to change:

### Repository or source location

The git repository, or the folder inside a monorepo, that Devopness should build.

### Source provider and credential

The git host and credential that can still read the source.

### Root directory

The folder that contains the package manager file for the application.
Use a subfolder when the source lives inside a monorepo.

### Default branch

The branch Devopness should use when a deploy does not specify another ref.

### Install dependencies command / Build command

Custom commands only when the defaults no longer match your stack.

## Using Devopness MCP

If you use Devopness from your IDE or an AI agent, try prompts like:

- "Update the `acme-api` application to use the `main` branch"
- "Change the repository for `acme-web`"
- "Update the build command for the application in Staging"

## After you save

- The application keeps the same identity in Devopness
- Existing linked resources stay attached unless you change them
- You may need to deploy again if the changes affect runtime behavior

## Verify

- The application details page shows the updated settings
- The repository, root directory, and commands match the new source layout

## Common issues

- You cannot save changes: confirm you still have edit permission
- A field validation error appears: check the updated repository path or command text
- The application still uses the old settings: confirm you saved the change in the correct environment

## What to do next

- Review the updated application in [View an Application](/docs/applications/view-application)
- Run a new [Deploy Application](/docs/applications/deploy-application) if the change affects runtime behavior
