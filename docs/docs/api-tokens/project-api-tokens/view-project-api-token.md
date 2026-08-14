---
title: View Project API Token
links:
  overview:
  quickstart:
  previous: api-tokens/project-api-tokens/list-project-api-tokens
  next: api-tokens/project-api-tokens/revoke-project-api-token
  guides:
    - api-tokens/project-api-tokens/list-project-api-tokens
  featured:
---

Review one project token's settings and status.

## Goal

Validate what a token can access before using it in production.

## What you see

- The token's name, role, and expiration
- Its usage details, so you can tell whether it is still in use
- Its scope within the project

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `acme-inc`, project `acme-platform`, show the details of the `ci-pipeline` project API token."
- "In organization `acme-inc`, project `acme-platform`, tell me what the `ci-pipeline` project API token is allowed to do."

## Verify

- You can confirm whether the token has the right scope and role
- You can decide whether to keep it or revoke it

## Common issues

- You cannot open the token: confirm you have permission and are looking at the right project

## What to do next

- [Revoke a Project API Token](/docs/api-tokens/project-api-tokens/revoke-project-api-token) when the token is no longer needed
