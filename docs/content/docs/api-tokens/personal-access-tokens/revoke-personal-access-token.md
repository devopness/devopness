---
title: Revoke a Personal Access Token
intro: Revoke a Personal Access Token to immediately prevent it from being used for future requests.
links:
    overview:
    quickstart:
    previous: api-tokens/personal-access-tokens/list-personal-access-tokens
    next: api-tokens/personal-access-tokens/add-personal-access-token
    guides:
    related:
    featured:
---

You should revoke a personal access token if it is no longer needed or was exposed to unauthorised access.

:::warning
Once revoked, a Personal Access Token **cannot be restored**.
A revoked token will no longer work for authentication in any future requests.
:::

Follow these steps to revoke a Personal Access Token:

1. On Devopness, in the upper-right corner of any page, click your profile icon then click `Personal Access Tokens`
2. The `Personal Access Tokens` list will be displayed
3. Find the `Personal Access Token` you want to revoke and click on `Name` of the token
4. On the upper-right corner click `REVOKE`
5. Follow the prompts then click `REVOKE TOKEN`
6. The revoked token will appear in the list of `Personal Access Tokens` with the status **Revoked**
