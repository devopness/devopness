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

They replace traditional username/password authentication with a token-based approach.

There are two types of API Tokens in Devopness:

- **Personal Access Tokens** - provide access across all projects the user can access.
- **Project API Tokens** - scoped to a single project, restricting access only to that project's resources.

## Usage

:::info

Every request must include a valid token in the **Authorization** header:

```bash
Authorization: Bearer <your_api_token>
```

:::
