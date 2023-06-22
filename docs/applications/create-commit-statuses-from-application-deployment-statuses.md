---
title: Create Commit Statuses from Application Deployment Statuses
intro: Outgoing Webhooks allow users to integrate Devopness to their current CI/CD Workflows. Learn how to create outgoing webhooks to update a commit status check to match your Devopness application deploy pipeline status.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

NOTE: Webhooks, for now, are an API only feature; so this post will guide you through the usage of our API to help you create an outgoing webhook.

NOTE: cURL requests can be imported to API clients, by following the API client's instructions on the links below:

- Postman: [Importing and exporting data: Importing with cURL commands](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-with-curl-commands)
- Insomnia: [Import and Export Data: Import Data](https://docs.insomnia.rest/insomnia/import-export-data#import-data)

NOTE: Insomnia uses curly braces syntax for environment variables, to avoid errors you need to disable the nunjuncks template feature for the request body. Further instructions at [Insomnia's FAQ](https://docs.insomnia.rest/insomnia/faq#how-can-i-temporarily-disable-nunjucks-template)

1. Take note of the `Application ID` (`<application_id>`) and `Deploy Pipeline ID` (`<pipeline_id>`) from the application which you want to watch the action statuses

   - Follow the [Deploy Application using an Incoming Hook](/docs/applications/deploy-application-using-incoming-hook) guide for detailed instructions

1. Take note of the `Repository Owner` (`<repo_owner>`) and `Repository Name` (`<repo_name>`) from the URL to the GitHub repository where the source code is hosted

   - Considering the following GitHub repository URL format `https://github.com/<repo_owner>/<repo_name>`

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /hooks/outgoing` to create a outgoing for the `action.started` event, replacing `<application_id>`, `<pipeline_id>`, `<repo_owner>`, `<repo_name>`

   - For further instructions, follow the guide [Create an Outgoing Webhook](/docs/webhooks/create-outgoing-webhook)

   {% raw %}
   ```bash
   curl --request POST \
     --url https://api.devopness.com/hooks/outgoing \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <access_token>' \
     --header 'Content-Type: application/json' \
     --data '{
       "name": "GitHub CI(build)",
       "action_type": "deploy",
       "resource_type": "application",
       "resource_id": <application_id>,
       "target_url": "https:\/\/api.github.com\/repos\/<repo_owner>\/<repo_name>\/statuses\/{{ action.triggered_from.hook_parsed_variables.commit_hash }}",
       "settings": {
         "request_headers": [
           {
             "name": "Authorization",
             "value": "Bearer {{ application.source_provider.access_token }}"
           },
           {
             "name": "Accept",
             "value": "application\/vnd.github+json"
           },
           {
             "name": "X-GitHub-Api-Version",
             "value": "2022-11-28"
           }
         ],
         "request_body": {
           "state": "pending",
           "target_url": "https:\/\/app.devopness.com\/actions\/{{ action.id }}",
           "description": "Application building started",
           "context": "ci\/devopness(build)",
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

1. Repeat the previous step, changing the `request_body` and `trigger_when.events`, to create the commit status to the `action.failed` state.

   {% raw %}
   ```bash
   …
         "request_body": {
           "state": "failure",
           "target_url": "https:\/\/app.devopness.com\/actions\/{{ action.id }}",
           "description": "Application building failed",
           "context": "ci\/devopness(build)",
         }
       },
       "trigger_when": {
         "events": [
           "action.failed"
         ],
   …
   ```
   {% endraw %}

   - NOTE: the field `request_body.context` needs to be the same for all the action status; this way the same commit status will be updated, instead of creating a new entry for every state.

1. Repeat the previous step, changing the `request_body` and `trigger_when.events`, to create the commit status to the `action.completed` state.

   {% raw %}
   ```bash
   …
         "request_body": {
           "state": "success",
           "target_url": "https:\/\/app.devopness.com\/actions\/{{ action.id }}",
           "description": "Application building success",
           "context": "ci\/devopness(build)",
         }
       },
       "trigger_when": {
         "events": [
           "action.completed"
         ],
   …
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
