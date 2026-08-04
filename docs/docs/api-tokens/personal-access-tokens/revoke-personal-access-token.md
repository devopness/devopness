---
title: Revoke a Personal Access Token
links:
  overview:
  quickstart:
  previous: api-tokens/personal-access-tokens/list-personal-access-tokens
  next: api-tokens/personal-access-tokens/add-personal-access-token
  guides:
    - api-tokens/personal-access-tokens/view-personal-access-token
  featured:
---

Revoke a Personal Access Token immediately.

## Goal

Stop a token from being used after it is no longer needed or has been exposed.

:::warning
Revoking a token is permanent. A revoked token cannot be restored.
:::

## What you need

- The Personal Access Token you want to revoke
- Confirmation that the token is no longer needed, because revocation is permanent

To revoke it:

1. Open `Personal Access Tokens`
2. Select the token you want to revoke
3. Click `REVOKE`
4. Confirm `REVOKE TOKEN`

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Revoke my `ci-deploy` personal access token."
- "Revoke the personal access token that was last used today."

## Verify

- The token can no longer authenticate requests
- Its status changes to revoked in the list

## Common issues

- You cannot revoke it: confirm you have permission to manage the token
- A revoked token still appears active: refresh the list

## What to do next

- [Add a Personal Access Token](/docs/api-tokens/personal-access-tokens/add-personal-access-token) to replace a revoked token
