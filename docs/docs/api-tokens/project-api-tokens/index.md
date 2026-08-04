---
title: Project API Tokens
links:
  overview:
  quickstart:
  previous: api-tokens/index
  next: api-tokens/project-api-tokens/list-project-api-tokens
  guides:
    - api-tokens/personal-access-tokens/index
  featured:
---

A Project API Token is a credential scoped to a single project.

It is the safer choice for service-to-service and CI/CD flows where least-privilege access is required.

## About

- Access is limited to resources in the selected project
- RBAC controls what each token can do within that project
- User-level account data, such as user details and invitations, is not exposed

## Who this is for

- Teams and automations that need recurring access to one project
- CI/CD pipelines and service accounts that should not use a user's personal token
- Anyone who wants least-privilege, production-safe API access

## Why this exists

Project API Tokens keep permission scope small. Instead of a token that can act as a user across everything, a project token can only reach the resources of the project you choose.

## Relationship to other concepts

- **API Tokens** group both Project API Tokens and Personal Access Tokens
- **Personal Access Tokens** inherit a user's full permissions and are better for one-off, personal tooling
- **Roles and permissions** control what each token can do inside the project

## Which token should I use

Use a Project API Token when a service needs recurring access to one project, when multiple people share the automation, or when you want production-safe access.
For personal, temporary, or user-like tasks, use a [Personal Access Token](/docs/api-tokens/personal-access-tokens/index).

## Start here

- [List Project API Tokens](/docs/api-tokens/project-api-tokens/list-project-api-tokens)
- [Add a Project API Token](/docs/api-tokens/project-api-tokens/add-project-api-token)
