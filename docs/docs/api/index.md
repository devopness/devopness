---
title: API
intro:
links:
    overview:
    quickstart:
    previous:
    next: api-tokens/index
    guides:
    related:
    featured:
---

At Devopness we treat our `API-as-a-Product`, meaning that every feature in our product is first designed with the API usage in mind, resulting in an API that is easy to use, well documented and actively maintained and supported.

This `API-first` development approach makes it possible that every piece of functionality available to users of our web app can also be automated and integrated with external systems.


## Usage
The base URL for Devopness API is https://api.devopness.com/

Before submitting your first request, make sure to obtain a token following the instructions in [/docs/api-tokens/index].

Once a token is obtained, you can test access to Devopness API using the example requests below:

:::

:::note

The examples below use `cURL`, which is a command line utility to be used from a terminal window. If you're not familiar with running commands on a terminal or you simply don't want to use a terminal you could, alternatively, copy the examples and import the `cURL` command line into your favorite API client platform. Here are links with instructions on how to achieve that on some of the most popular API client platforms:

- [Postman](https://learning.postman.comgetting-started/importing-and-exporting-data/#importing-with-curl-commands)
- [Insomnia](https://docs.insomnia.rest/insomnia/import-export-data#import-data)

:::

To send your first API request using `curl`:

1. On your local machine open a terminal window
2. Make a copy of the `curl` request below
3. Replace `<your_api_token>` with the value of your API Token
4. Replace `{project_id}` with the ID of your Devopness project (you can get ir from the project URL in https://app.devopness.com/)
4. Hit the ENTER key in the terminal to submit the request
```bash
curl --request GET \
    --url https://api.devopness.com/projects/{project_id} \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer <your_api_token>' \
    --header 'Content-Type: application/json'
```
5. If your token is valid and there are no syntax errors with your command, we should see a JSON response with details of your project
