---
title: Personal Access Tokens
intro:
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
      - api-tokens/index
      - api-tokens/personal-access-tokens/add-personal-access-token
    featured:
---

Personal Access Tokens (PATs) **inherit all permissions of the user who created them**.

They allow performing any action that the user is authorized to do across all projects accessible by the account.

:::info

Include the PAT in all API requests using the `Authorization` header:

```bash
Authorization: Bearer <your_api_token>
```

:::
