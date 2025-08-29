---
title: Project API Tokens
intro:
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
      - api-tokens/index
      - api-tokens/project-api-tokens/add-project-api-token
    featured:
---

API Tokens (project scoped) provide **restricted access to resources within a specific project**.

Permissions are defined by the role assigned to the token, making them ideal for automation's, scripts, or integrations that should not access resources outside the project.

:::info

Include the token in all project-related requests using the `Authorization` header:

```bash
Authorization: Bearer <your_api_token>
```

:::
