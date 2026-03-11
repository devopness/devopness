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

## Steps

1. Open `Personal Access Tokens`
2. Select the token you want to revoke
3. Click `REVOKE`
4. Confirm `REVOKE TOKEN`

## Result

- The token can no longer authenticate requests
- Its status changes to revoked

## Common issues

- You cannot revoke it: confirm you have permission to manage the token
- Revoked token still appears active: refresh the list
