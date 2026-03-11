---
title: API Tokens
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
    related:
      - api-tokens/personal-access-tokens/index
      - api-tokens/project-api-tokens/index
  featured:
---

API Tokens let tools and automations authenticate securely when working with the Devopness API.

## Types of API Tokens

### Personal Access Tokens

A Personal Access Token uses your user identity and inherits your permissions.
Use it when automation should behave like a user.

- It can access resources your user can access
- It is useful for quick scripts and local tooling
- It can work across multiple projects where the user has access

### Project API Tokens

Project API Tokens are scoped to one project and safer for shared automation.

- Access is limited to resources in that project
- RBAC controls what each token can do
- User-level endpoints, such as `/users` details and invitations, are not included

## Which token should I use

Use Personal Access Tokens when:

- You need one-off user-like access
- A task is personal and temporary

Use Project API Tokens when:

- A service needs recurring access to one project
- Multiple people share the automation
- You want least-privilege production-safe access

:::note
When you can, prefer `Project API Tokens` to keep permission scope small.

:::
