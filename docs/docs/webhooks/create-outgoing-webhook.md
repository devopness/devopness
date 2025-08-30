---
title: Create an Outgoing Webhook
intro: Outgoing Webhooks are a simple way integrate your Devopness environment with external services, triggering a request when an action of a resource has its state updated. Some use cases of resource action state updates are “a new application deployment is done”, “the server is now stopped” and many more use cases that can benefit from webhooks integration. Learn how to create an outgoing webhook to comment the application deploy status on a Pull Request/Merge Request.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

:::note

Webhooks, for now, are an API only feature; so this post will guide you through the usage of our API to help you create an outgoing webhook.

:::

:::note

The examples below use `cURL`, which is a command line utility to be used from a terminal window. If you're not familiar with running commands on a terminal or you simply don't want to use a terminal you could, alternatively, copy the examples and import the `cURL` command line into your favorite API client platform. Here are links with instructions on how to achieve that on some of the most popular API client platforms:

- [Postman](https://learning.postman.comgetting-started/importing-and-exporting-data/#importing-with-curl-commands)
- [Insomnia](https://docs.insomnia.rest/insomnia/import-export-data#import-data)

:::


1. Take note of the ID (`<pipeline_id>`) of a pipeline that runs the `deploy` operation for the application which you want to watch the action statuses
    - Follow the [/docs/applications/deploy-application-using-incoming-hook] guide for detailed instructions
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
1. Take note of the `Target URL` (`<target_url>`), `Request Headers` (`<request_headers>`) and `Request Body` (`<request_body>`) fields according to the source provider where the application' source code is hosted, by following the source provider's instructions on the links bellow:
   - [Bitbucket](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-pullrequests/#api-repositories-workspace-repo-slug-pullrequests-pull-request-id-comments-post)
   - [Github](https://docs.github.com/en/rest/issues/comments#create-an-issue-comment)
   - [Gitlab](https://docs.gitlab.com/ee/api/notes.html#create-new-issue-note)
1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /pipelines/:id/hooks/outgoing` to create an outgoing webhook to comment on the Pull Request using the source provider where the application' source code is hosted. In the example below, replace `<pipeline_id>`, `<target_url>`, `<request_headers>` and `<request_body>` with the actual values of each parameter before submitting the request.

    ```bash
    curl --request POST \
      --url https://api.devopness.com/pipelines/<pipeline_id>/hooks/outgoing \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json' \
      --data '{
        "name": "CD(deploy)",
        "action_type": "deploy",
        "target_url": "https://<target_url>/{{ action.triggered_from.hook_parsed_variables.pull_request_id }}",
        "settings": {
          "request_headers": [
            {
              "name": "Authorization",
              "value": "Bearer {{ application.source_provider.access_token }}"
            }
            // NOTE: add Request Headers (`<request_headers>`) here
          ],
          "request_body": {
            // NOTE: review the fields below according to Request Body (`<request_body>`)
            "body": "Deployed pipeline for `PR #{{ action.triggered_from.hook_parsed_variables.pull_request_id }} ({{ action.triggered_from.hook_parsed_variables.pull_request_title }})`: Devopness application `{{ application.name }}` deployment **{{ action.status }}** on action <https:\/\/{{ application.name }}> using [commit](https://github.com/devopness/devopness-site/commit/{{ action.triggered_from.hook_parsed_variables.commit_hash }})"
          }
        },
        "trigger_when": {
          "events": [
            "action.status_changed"
          ]
        }
      }'
    ```

1. On your local machine, in a terminal window, run command to list all the pipeline webhooks, replacing `<pipeline_id>`.
    ```bash
    curl --request GET \
      --url https://api.devopness.com/pipelines/<pipeline_id>/hooks \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json'
    ```
1. In the previous command response, the recently created hook will be included in the list

