---
title: List Project API Tokens
links:
  overview:
  quickstart:
  previous: api-tokens/project-api-tokens/index
  next: api-tokens/project-api-tokens/add-project-api-token
  guides:
    - api-tokens/project-api-tokens/add-project-api-token
  featured:
---

Find all project-scoped API Tokens for one project.

## Goal

Pick the right token for a given automation run or service.

## What you see

- Token status, scope, and usage per token
- A way to open one token for details

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme-inc`, project `acme-platform`, list the project API tokens."
- "In organization `acme-inc`, project `acme-platform`, show me which project API tokens are still active."

## Verify

- You can see all project API tokens for the selected project
- You can identify which token fits the automation and which has the right scope

## Common issues

- The list is empty: create a token first
- A token is missing: confirm you are looking at the right project

## What to do next

- [Add a Project API Token](/docs/api-tokens/project-api-tokens/add-project-api-token) to create a new one
- [View a Project API Token](/docs/api-tokens/project-api-tokens/view-project-api-token) to review details
