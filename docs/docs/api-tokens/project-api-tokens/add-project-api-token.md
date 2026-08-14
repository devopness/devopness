---
title: Add a Project API Token
links:
  overview:
  quickstart:
  previous: api-tokens/project-api-tokens/list-project-api-tokens
  next: api-tokens/project-api-tokens/view-project-api-token
  guides:
    - api-tokens/project-api-tokens/list-project-api-tokens
  featured:
---

Generate a new project-scoped token for tools and automations.

## Goal

Create a token that can only access one project.

## What you need

- A project where you can manage API tokens
- A clear purpose and a role for the token, so it gets only the permissions it needs

To create it:

1. Open the target project
2. Open `API Tokens`
3. Click `VIEW ALL`
4. Click `ADD API TOKEN`
5. Follow the prompts, choose the role, and confirm

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme-inc`, project `acme-platform`, create a project API token with deploy-only permissions."
- "In organization `acme-inc`, project `acme-platform`, add a project API token for the CI pipeline and set its role."

## Verify

- A new project API token is created
- You copy and store the token value immediately, because it is shown only once at creation time
- The token has access only to the resources of the selected project

## Common issues

- You cannot add a token: confirm your role in the project
- You cannot copy the token later: the token is shown only once, so store it right away

## What to do next

- [View a Project API Token](/docs/api-tokens/project-api-tokens/view-project-api-token) to review its scope
- [Revoke a Project API Token](/docs/api-tokens/project-api-tokens/revoke-project-api-token) when it is no longer needed
