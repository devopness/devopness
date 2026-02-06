---
title: Find your Devopness Activity Summary
intro: Curious about how much have Devopness impacted your infraestructure management related work? Why not check how much have we accomplished together using your activity summary information.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

1. Obtain a `Personal Access Token` by following the instructions in [/docs/api-tokens/personal-access-tokens/index]
1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `GET /users/me`, replacing `<personal_access_token>` with the value of your `Personal Access Token`
```bash
curl --request GET \
  --url https://api.devopness.com/users/me \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer <personal_access_token>' \
  --header 'Content-Type: application/json'
```
1. From the previous command response, copy the field `id`
1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `GET /users/<user_id>/activity`, replacing `<personal_access_token>` and `<id>`
```bash
curl --request GET \
  --url https://api.devopness.com/users/<id>/activity \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer <personal_access_token>' \
  --header 'Content-Type: application/json'
```
