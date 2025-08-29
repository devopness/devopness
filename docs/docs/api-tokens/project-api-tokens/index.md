---
title: Project API Tokens
intro: Project API Tokens provide role-based access to resources within a single project.
links:
    overview:
    quickstart:
    previous: api-tokens/index
    next:
    guides:
    related:
      - api-tokens/project-api-tokens/list-project-api-tokens
      - api-tokens/project-api-tokens/add-project-api-token
    featured:
---

Permissions are defined by the role assigned to the token, making them ideal for automation's, scripts, or integrations that should not access resources outside the project.

## Usage

:::info

Include the token in all project-related requests using the `Authorization` header:

```bash
Authorization: Bearer <your_api_token>
```

:::
