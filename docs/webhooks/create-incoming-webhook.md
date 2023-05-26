---
title: Create an Incoming Webhook
intro: Incoming Webhooks are a simple way to integrate external services with your Devopness environments, using a unique URL through which a JSON payload can be sent to run a pipeline with custom input data. Some use cases of external services events include "deploy applications automatically based on GitHub/GitLab/Bitbucket repository updates", "provision and scale infrastructure resources when you payment gateway confirms that a custom subscription has been processed", and many more use cases that can benefit from webhooks integration. Learn how to create an incoming webhook to run pipelines programmatically when events happen on external services.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

At Devopness we treat our `API-as-a-Product`, meaning that every feature in our product is first designed with the API usage in mind, resulting in an API that is easy to use, well documented and actively maintained and supported.

This `API-first` development approach makes it possible that every piece of functionality available to users of our web app can also be automated and integrated with external systems.

Devopness webhooks are a highly performant way to allow applications to push data from external events to trigger pipelines on your infrastructure environments, increasing productivity and reliability while working on cloud applications and infrastructure management workflows.

Webhooks, for now, are an API only feature; so this post will guide you through the usage of our API to help you create a webhook.

To create our incoming webhook, we need the `Application ID` (`<application_id>`).

<details open>
  <summary>Steps to find `Application ID`</summary>

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications find the application with the pipeline you want to manage and click `DETAILS`
1. Copy the `Application ID` from the URL, considering the following URL format:
    ```bash
    https://app.devopness.com/projects/<project_id>/environments/<environment_id>/applications/<application_id>
    ```

</details>

Once you have your `Application ID` (`<application_id>`), please follow the instructions below to add a incoming webhook to your application:

1. In a terminal window, run [POST /users/login](https://api-docs.devopness.com/#tag/Users/operation/loginUser) request using your Devopness account email and password
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
1. In a terminal window, run [POST /hooks/incoming](https://api-docs.devopness.com/#tag/Hooks/operation/addHook) request, replacing `<application_id>`.
    ```bash
    curl --request POST \
      --url https://api.devopness.com/hooks/incoming \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json' \
      --data '{
    	"name": "Pipeline triggered via incoming hook",
    	"requires_secret": false,
    	"action_type": "deploy",
    	"resource_type": "application",
    	"resource_id": <application_id>,
        "settings": {
		    "variables": [
    			{
		    		"name": "pipeline_id",
				    "type": "integer",
    				"required": true
    			}
		    ]
    	}
    }'
    ```
1. From the previous command response, copy the field `url`
    > This is the hook unique URL used to integrate with external services
1. In a terminal window, run command to list all the application hooks, replacing `<application_id>`.
    ```bash
    curl --request GET \
      --url https://api.devopness.com/applications/<application_id>/hooks \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json'
    ```
1. In the previous command response, the recently created hook will be included in the list.
