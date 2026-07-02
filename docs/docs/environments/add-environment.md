---
title: Add an Environment
links:
  overview:
  quickstart:
  previous: projects/add-project
  next: credentials/add-credential
  guides:
    - environments/list-environments
    - environments/remove-environment
  featured:
---

Create an environment to separate infrastructure and release flow inside one project.

## Goal

Add a separate infrastructure setup for development, staging, production, or a custom release flow.

## Prerequisites

- Permission to add environments in the target project
- The correct project selected in the organization

## What you need

### Name

A clear environment name, such as `Production`, `Staging`, or `Development`.

### Environment type

The type that matches how you plan to use this environment.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Add a Production environment to the `acme-platform` project"
- "Create a Staging environment in my current project"
- "Add a Development environment named `dev`"

## After you save

- The environment appears in the environments list
- You can add servers, applications, and other resources in it

## Verify

- The environment appears with the name and type you set
- You can open it and start adding resources

## Common issues

- You do not see `Add Environment`: check your project permissions
- Environment name is already used in this project: choose a different name
- You cannot save: confirm you have permission to add environments

## What to do next

- [List environments](/docs/environments/list-environments)
- [Add applications](/docs/applications/add-application) in the new environment
