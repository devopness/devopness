---
title: Integrate Application deployments with your Continuous Integration (CI) workflows
intro: Learn how to create outgoing webhooks to integrate the application deployment with your existing CI workflow.
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

1. Make sure you have API access by following the instructions in [/docs/api/index]
1. Take note of the ID (`<pipeline_id>`) of a pipeline that runs the `deploy` operation for the application which you want to watch the action statuses
   - Follow the [/docs/applications/deploy-application-using-incoming-hook] guide for detailed instructions

1. Take note of the `Target URL` (`<target_url>`), `Request Headers` (`<request_headers>`) and `Request Body` (`<request_body>`) fields according to the source provider where the application' source code is hosted, by following the source provider's instructions on the links bellow:
   - [Bitbucket](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-commit-statuses/#api-repositories-workspace-repo-slug-commit-commit-statuses-build-post)
   - [Github](https://docs.github.com/en/rest/commits/statuses#create-a-commit-status)
   - [Gitlab](https://docs.gitlab.com/ee/api/commits.html#set-the-pipeline-status-of-a-commit)

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /pipelines/:id/hooks/outgoing` to create an outgoing webhook for the `action.started` event. In the example below, replace `<pipeline_id>`, `<target_url>`, `<request_headers>` and `<request_body>` with the actual values of each parameter before submitting the request.

   - For further instructions, follow the guide [/docs/webhooks/create-outgoing-webhook]


   ```bash
   curl --request POST \
     --url https://api.devopness.com/pipelines/<pipeline_id>/hooks/outgoing \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json' \
     --data '{
       "name": "CI(build)",
       "action_type": "deploy",
       "target_url": "https://<target_url>/{{ action.triggered_from.hook_parsed_variables.commit_hash }}",
       "settings": {
         "request_headers": [
           {
             "name": "Authorization",
             "value": "Bearer {{ application.source_provider.access_token }}"
           }
           // NOTE: add Request Headers (`<request_headers>`) here
         ],
         "request_body": {
           // NOTE: review the fields bellow according to Request Body (`<request_body>`) from the source provider instructions
           "state": <source_provider_pipeline_status>,
           "target_url": "https://app.devopness.com/actions/{{ action.id }}",
           "url": "https://app.devopness.com/actions/{{ action.id }}",
           "description": "Application building started",
           "context": "ci\/devopness(build)",
           "key": "ci\/devopness(build)"
         }
       },
       "trigger_when": {
         "events": [
           "action.started"
         ]
       }
     }'
   ```


1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /pipelines/:id/hooks/outgoing` to create an outgoing webhook for the `action.failed` event. In the example below, replace `<pipeline_id>`, `<target_url>`, `<request_headers>` and `<request_body>` with the actual values of each parameter before submitting the request.


   ```bash
   curl --request POST \
     --url https://api.devopness.com/pipelines/<pipeline_id>/hooks/outgoing \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json' \
     --data '{
       "name": "CI(build)",
       "action_type": "deploy",
       "target_url": "https://<target_url>/{{ action.triggered_from.hook_parsed_variables.commit_hash }}",
       "settings": {
         "request_headers": [
           {
             "name": "Authorization",
             "value": "Bearer {{ application.source_provider.access_token }}"
           }
           // NOTE: add Request Headers (`<request_headers>`) here
         ],
         "request_body": {
           // NOTE: review the fields bellow according to Request Body (`<request_body>`) from the source provider instructions
           "state": <source_provider_pipeline_status>,
           "target_url": "https://app.devopness.com/actions/{{ action.id }}",
           "url": "https://app.devopness.com/actions/{{ action.id }}",
           "description": "Application building failed",
           "context": "ci\/devopness(build)",
           "key": "ci\/devopness(build)"
         }
       },
       "trigger_when": {
         "events": [
           "action.failed"
         ]
       }
     }'
   ```


   - NOTE: the field `request_body.context` needs to be the same for all the action status; this way the same commit status will be updated, instead of creating a new entry for every state.

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /pipelines/:id/hooks/outgoing` to create an outgoing webhook for the `action.completed` event. In the example below, replace `<pipeline_id>`, `<target_url>`, `<request_headers>` and `<request_body>` with the actual values of each parameter before submitting the request.


   ```bash
   curl --request POST \
     --url https://api.devopness.com/pipelines/<pipeline_id>/hooks/outgoing \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json' \
     --data '{
       "name": "CI(build)",
       "action_type": "deploy",
       "target_url": "https://<target_url>/{{ action.triggered_from.hook_parsed_variables.commit_hash }}",
       "settings": {
         "request_headers": [
           {
             "name": "Authorization",
             "value": "Bearer {{ application.source_provider.access_token }}"
           }
           // NOTE: add Request Headers (`<request_headers>`) here
         ],
         "request_body": {
           // NOTE: review the fields below according to Request Body (`<request_body>`) from the source provider instructions
           "state": <source_provider_pipeline_status>,
           "target_url": "https://app.devopness.com/actions/{{ action.id }}",
           "url": "https://app.devopness.com/actions/{{ action.id }}",
           "description": "Application building success",
           "context": "ci\/devopness(build)",
           "key": "ci\/devopness(build)"
         }
       },
       "trigger_when": {
         "events": [
           "action.completed"
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

1. In the previous command response, the recently created hooks will be included in the list
