---
title: Personal Access Tokens (PATs)
intro: Personal Access Tokens (PATs) provide full access to the Devopness API with the same permissions as the user who created them.
links:
    overview:
    quickstart:
    previous: api-tokens/index
    next:
    guides:
    related:
      - api-tokens/personal-access-tokens/list-personal-access-tokens
      - api-tokens/personal-access-tokens/add-personal-access-token
    featured:
---

They allow performing any action the user is authorized to do across all projects accessible to their account.

## Usage

:::info

Include the PAT in all API requests using the `Authorization` header:

```bash
Authorization: Bearer <your_api_token>
```

:::
