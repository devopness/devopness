---
title: API Tokens
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
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

## Using Devopness MCP

API tokens can be created and managed through Devopness MCP. Name the organization, project, and token type so the agent targets the right resource, and confirm each operation completes with a clear success signal.

- "In organization `acme-inc`, project `acme-platform`, create a project API token for the CI pipeline, then return the token and its scope so I can store it."
- "List my personal access tokens and tell me how many are active."
- "Revoke the `ci-deploy` project API token in `acme-inc`/`acme-platform` and confirm it is no longer active."

You are done when the agent returns the created token or an updated status that matches the operation (created, listed, or revoked).

## Practical example

A `ci-deploy` pipeline needs to deploy one application each time you push to git:

- Create a **Project API Token** scoped to the `acme-platform` project
- Give it a deploy-only role so it can trigger deploys but not change other resources
- Store the token value once at creation time and use it in the automation

This keeps the token from being able to act like a full user or reach resources outside that project.

