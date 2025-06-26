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

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /users/login` using your Devopness account email and password
    ```bash
    curl --request POST \
      --url https://api.devopness.com/users/login \
      --header 'Accept: application/json' \
      --header 'Content-Type: application/json' \
      --data '{
    	"email": "<email>",
    	"password": "<password>"
    }'
    ```
1. From the previous command response, copy the field `access_token`
1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `GET /users/me`, replacing `<access_token>`
    ```bash
    curl --request GET \
      --url https://api.devopness.com/users/me \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json'
   ```
1. From the previous command response, copy the field `id`
1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `GET /users/<user_id>/activity`, replacing `<id>` and `<access_token>`
    ```bash
    curl --request GET \
      --url https://api.devopness.com/users/<id>/activity \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json'
   ```

