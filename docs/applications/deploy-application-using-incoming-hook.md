---
title: Deploy Application using an Incoming Hook
intro: As project teams and users base grow, there's a need to rely more on processes and automation; Devopness helps those teams by providing, among other tools, customizable CI/CD pipelines, empowering our users to automate common and repetitive tasks to improve code quality and their code review processes. Create a incoming webhook to trigger a application deploy programmatically.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

Devopness is an API-First product, meaning that every feature in our product is first designed with the API usage in mind. That development approach implies that every action you make using our web app can also be directly made using API calls.

Webhooks, for now, are an API only feature; so this post will guide you through the usage of our API to help you create a webhook.

Before creating our incoming webhook, we need the `Application ID` (`<application_id>`) and `Pipeline ID` (`<pipeline_id>`) to use as parameters in our API calls.

<details open>
  <summary>Steps to find `Pipeline ID` and `Application ID`</summary>

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications, find the application with the pipeline you want to manage and click `DETAILS`
1. On the upper-right corner of the applications details view click `SETTINGS`
1. Use the drop-down menu to choose `PIPELINES`
1. In the list of pipelines, find the pipeline you want to manage and click `DETAILS`
    > If you haven't created a pipeline yet, follow the [Add a Pipeline](/docs/pipelines/add-pipeline) guide
1. Copy the `Application ID` and `Pipeline ID` from the URL, considering the following URL format:
```bash
https://app.devopness.com/projects/<project_id>/environments/<environment_id>/applications/<application_id>/pipelines/<pipeline_id>
```

</details>

Once you have your `Application ID` (`<application_id>`) and `Pipeline ID` (`<pipeline_id>`), please follow the instructions below to add a incoming webhook to your pipeline:

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
1. In a terminal window, run [POST /hooks/incoming](https://api-docs.devopness.com/#tag/Hooks/operation/addHook) request, replacing `<access_token>`, `<application_id>` and `<pipeline_id>`.
    ```bash
    curl --request POST \
      --url https://api.devopness.com/hooks/incoming \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json' \
      --data '{
    	"name": "CI/CD pipeline triggered",
    	"requires_secret": false,
    	"action_type": "deploy",
    	"resource_type": "application",
    	"resource_id": <application_id>,
    	"settings": {
    		"variables": [
    			{
    				"name": "branch",
	    			"type": "string",
		    		"required": false,
			    	"default_value": "main"
    			},
	    		{
		    		"name": "pipeline_id",
			    	"type": "integer",
				    "required": false,
    				"default_value": <pipeline_id>
	    		}
		    ]
    	},
	    "trigger_when": {
		    "conditions": []
    	}
    }'
    ```
1. From the previous command response, copy the field `url`
    > This is the hook unique URL
1. In a terminal window, run the command below to test the trigger
    ```bash
    curl --request POST \
      --url <hook unique url> \
      --header 'Accept: application/json' \
      --header 'Content-Type: application/json' \
      --data '{}'
    ```
1. On the chosen Devopness environment, click `View` in the `Applications` card to see a list of existing `Applications`
1. Click `DETAILS` on the application you triggered the pipeline
1. On the upper-right corner click `DEPLOYMENTS`
1. Click `LOGS` on the action triggered by incoming hook
    > In `START TIME` column, the name of the subject, user or incoming hook, that triggered the action will be visible, e.g: CI/CD pipeline triggered
