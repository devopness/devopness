---
title: API Tokens
intro: API Tokens are the primary way to authenticate when interacting with the Devopness API.
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

## Types of API Tokens

Two types of API Tokens are currently supported: `Project API Tokens` and `Personal Access Tokens`.

Whenever possible, Devopness recommends the usage of `Project API Tokens` for fine-grained permission management.

### Personal Access Tokens

A token has the same capabilities to access resources and perform actions on those resources that the owner of the token has, allowing a user to perform any operation using Devopness API, including:
1. Create and manage Projects
2. Create and manage Environments in a project
3. Accept user Team Invitations
4. Create and manage Personal Access Tokens

### Project API Tokens

Project API Tokens have several security advantages over personal access tokens, such as:

1. Scope limited to access resources in the project where the token was created
1. Fine-grained permission management using RBAC (Role-based Access Control)
1. Do not allow access to `/users` specific endpoints, such as user details, activity and invitations
