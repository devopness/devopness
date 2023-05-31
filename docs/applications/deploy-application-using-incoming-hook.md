---
title: Deploy Application using an Incoming Hook
intro: As project users base grow, there's a need to rely more on processes and automation; Devopness helps by providing, among other tools, customizable CI/CD pipelines, empowering our users to automate common and repetitive tasks to improve code quality and their code review processes. Create a incoming webhook to trigger a application deploy programmatically.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

Before creating our application deploy incoming webhook, we need the `Application ID` (`<application_id>`) and `Deploy Pipeline ID` (`<pipeline_id>`) to use as parameters in our API calls.

<details open>
  <summary>Steps to find `Application ID` and `Deploy Pipeline ID`</summary>

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications, find the application with the pipeline you want to manage and click `DETAILS`
1. On the upper-right corner of the applications details view click `SETTINGS`
1. Use the drop-down menu to choose `PIPELINES`
1. In the list of pipelines, find the pipeline you want to manage and click `DETAILS`
    > If you haven't created a pipeline yet, follow the [Add a Pipeline](/docs/pipelines/add-pipeline) guide
1. Copy the `Application ID` and `Deploy Pipeline ID` from the URL, considering the following URL format:
    ```bash
    https://app.devopness.com/projects/<project_id>/environments/<environment_id>/applications/<application_id>/pipelines/<pipeline_id>
    ```

</details>

Once you have your `Application ID` (`<application_id>`) and `Deploy Pipeline ID` (`<pipeline_id>`), please follow the instructions below to add an incoming webhook to your application that triggers the deploy pipeline:

1. In a terminal window, submit a request to Devopness API endpoint `POST /hooks/incoming`, replacing `<access_token>`, `<application_id>` and `<pipeline_id>`.
    > If this is your first time calling the Devopness API, follow the [Create an Incoming Webhook](/docs/webhooks/create-incoming-webhook) guide to see instructions on getting your `<access_token>`.
    ```bash
    curl --request POST \
      --url https://api.devopness.com/hooks/incoming \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json' \
      --data '{
    	"name": "run pipeline <pipeline_id> on application <application_id> using main branch",
    	"requires_secret": true,
    	"secret_algorithm": "sha256",
    	"secret_header_name": "x-hub-signature-256",
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
    	}
    }'
    ```
1. From the previous command response, copy the fields `url` (unique hook URL) and `secret` (signature key)
1. Add your webhook to your source provider
    - Follow Bitbucket' [Manage webhooks: create webhooks](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/#Create-webhooks) guide; or
    - Follow Github' [Webhooks: setting up a webhook](https://docs.github.com/en/webhooks-and-events/webhooks/creating-webhooks#setting-up-a-webhook) guide; or
    - Follow Gitlab' [Webhooks: configure a webhook in GitLab](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#configure-a-webhook-in-gitlab) guide.
1. Trigger the webhook, using the configured source provider event trigger options
1. On the chosen Devopness environment, click `View` in the `Applications` card to see a list of existing `Applications`
1. Click `DETAILS` on the application you triggered the pipeline
1. On the upper-right corner click `DEPLOYMENTS`
1. Click `LOGS` on the action triggered by incoming hook
    > In `START TIME` column, the name of the subject, user or incoming hook, that triggered the action will be visible, e.g: CI/CD pipeline triggered