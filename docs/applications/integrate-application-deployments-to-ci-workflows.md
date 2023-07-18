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

{% note %}

**NOTE**: Webhooks, for now, are an API only feature; so this post will guide you through the usage of our API to help you create an outgoing webhook.

{% endnote %}

{% note %}

**NOTE**: The examples below use `cURL`, which is a command line utility to be used from a terminal window. If you're not familiar with running commands on a terminal or you simply don't want to use a terminal you could, alternatively, copy the examples and import the `cURL` command line into your favorite API client platform. Here are links with instructions on how to achieve that on some of the most popular API client platforms:

- [Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-with-curl-commands)
- [Insomnia](https://docs.insomnia.rest/insomnia/import-export-data#import-data)

{% endnote %}


1. Take note of the `Application ID` (`<application_id>`) and `Deploy Pipeline ID` (`<pipeline_id>`) from the application which you want to watch the action statuses
   - Follow the [Deploy Application using an Incoming Hook](/docs/applications/deploy-application-using-incoming-hook) guide for detailed instructions

1. Take note of the `Target URL` (`<target_url>`), `Request Headers` (`<request_headers>`) and `Request Body` (`<request_body>`) fields according to the source provider where the application' source code is hosted, by following the source provider's instructions on the links bellow:
   - [Bitbucket](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-commit-statuses/#api-repositories-workspace-repo-slug-commit-commit-statuses-build-post)
   - [Github](https://docs.github.com/en/rest/commits/statuses#create-a-commit-status)
   - [Gitlab](https://docs.gitlab.com/ee/api/commits.html#set-the-pipeline-status-of-a-commit)

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /hooks/outgoing` to create a outgoing for the `action.started` event, replacing `<application_id>`, `<pipeline_id>`, `<target_url>`, `<request_headers>` and `<request_body>`

   - For further instructions, follow the guide [Create an Outgoing Webhook](/docs/webhooks/create-outgoing-webhook)

   {% raw %}
   ```bash
   curl --request POST \
     --url https://api.devopness.com/hooks/outgoing \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json' \
     --data '{
       "name": "CI(build)",
       "action_type": "deploy",
       "resource_type": "application",
       "resource_id": <application_id>,
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
         ],
         "conditions": [
           {
             "path": "action.triggered_from.hook_parsed_variables.pipeline_id",
             "accepted_values": [
               <pipeline_id>
             ]
           }
         ]
       }
     }'
   ```
   {% endraw %}

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /hooks/outgoing` to create a outgoing for the `action.failed` event, replacing `<application_id>`, `<pipeline_id>`, `<target_url>`, `<request_headers>` and `<request_body>`

   {% raw %}
   ```bash
   curl --request POST \
     --url https://api.devopness.com/hooks/outgoing \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json' \
     --data '{
       "name": "CI(build)",
       "action_type": "deploy",
       "resource_type": "application",
       "resource_id": <application_id>,
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
         ],
         "conditions": [
           {
             "path": "action.triggered_from.hook_parsed_variables.pipeline_id",
             "accepted_values": [
               <pipeline_id>
             ]
           }
         ]
       }
     }'
   ```
   {% endraw %}

   - NOTE: the field `request_body.context` needs to be the same for all the action status; this way the same commit status will be updated, instead of creating a new entry for every state.

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /hooks/outgoing` to create a outgoing for the `action.completed` event, replacing `<application_id>`, `<pipeline_id>`, `<target_url>`, `<request_headers>` and `<request_body>`

   {% raw %}
   ```bash
   curl --request POST \
     --url https://api.devopness.com/hooks/outgoing \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json' \
     --data '{
       "name": "CI(build)",
       "action_type": "deploy",
       "resource_type": "application",
       "resource_id": <application_id>,
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
         ],
         "conditions": [
           {
             "path": "action.triggered_from.hook_parsed_variables.pipeline_id",
             "accepted_values": [
               <pipeline_id>
             ]
           }
         ]
       }
     }'
   ```
   {% endraw %}

1. On your local machine, in a terminal window, run command to list all the application hooks, replacing `<application_id>`.

   ```bash
   curl --request GET \
     --url https://api.devopness.com/applications/<application_id>/hooks \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json'
   ```

1. In the previous command response, the recently created hooks will be included in the list
