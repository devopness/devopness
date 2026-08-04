---
title: Revoke a Project API Token
links:
  overview:
  quickstart:
  previous: api-tokens/project-api-tokens/view-project-api-token
  next: api-tokens/project-api-tokens/add-project-api-token
  guides:
    - api-tokens/project-api-tokens/view-project-api-token
  featured:
---

Revoke a project token you no longer trust or need.

## Goal

Stop token authentication for that project immediately.

:::warning
Revoking a token is permanent. A revoked token cannot be restored.
:::

## What you need

- The project API token you want to revoke
- Confirmation that the token is no longer needed, because revocation is permanent

To revoke it:

1. Open the target project
2. Open `API Tokens` and `VIEW ALL`
3. Select the token to revoke
4. Click `REVOKE` and confirm

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme-inc`, project `acme-platform`, revoke the `ci-pipeline` project API token."
- "In organization `acme-inc`, project `acme-platform`, revoke the project API token that was exposed."

## Verify

- The token stops authenticating requests
- The list updates with a revoked status

## Common issues

- You cannot revoke the token: confirm your permissions in the project
- A revoked token still appears active: refresh the list

## What to do next

- [Add a Project API Token](/docs/api-tokens/project-api-tokens/add-project-api-token) to replace a revoked token
