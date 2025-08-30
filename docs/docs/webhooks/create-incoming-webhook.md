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
required_permissions:
    - application:read
    - hook:create
---

At Devopness we treat our `API-as-a-Product`, meaning that every feature in our product is first designed with the API usage in mind, resulting in an API that is easy to use, well documented and actively maintained and supported.

This `API-first` development approach makes it possible that every piece of functionality available to users of our web app can also be automated and integrated with external systems.

Devopness webhooks are a highly performant way to allow applications to push data from external events to trigger pipelines on your infrastructure environments, increasing productivity and reliability while working on cloud applications and infrastructure management workflows.

Webhooks, for now, are an API only feature; so this post will guide you through the usage of our API to help you create a webhook.

## Step 1: Get the data needed for creating a webhook

1. Make sure you have API access by following the instructions in [/docs/api/index]
1. Take note of the ID (`<pipeline_id>`) of the pipeline which you want to run programatically
    > Follow the [/docs/applications/deploy-application-using-incoming-hook] guide for detailed instructions
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

## Step 2: Create the webhook

1. On your local machine, in a terminal window, submit a request to Devopness API endpoint `POST /pipelines/:id/hooks/incoming`, replacing `<pipeline_id>`.
    ```bash
    curl --request POST \
      --url https://api.devopness.com/pipelines/<pipeline_id>/hooks/incoming \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json' \
      --data '{
    	"name": "Deploy `main` branch",
    	"requires_secret": true,
    	"secret_algorithm": "sha256",
    	"secret_header_name": "x-hub-signature-256",
    	"action_type": "deploy",
    	"settings": {
    		"variables": [
    			{
    				"name": "source_type",
	    			"type": "string",
		    		"required": false,
			    	"default_value": "branch"
    			},
    			{
    				"name": "source_ref",
    				"path": "pull_request.head.ref",
	    			"type": "string",
		    		"required": false,
			    	"default_value": "main"
    			},
 	    		{
		    		"name": "pull_request_id",
		    		"path": "pull_request.number",
		    		"type": "integer",
		    		"required": false
	    		},
	    		{
		    		"name": "pull_request_title",
		    		"path": "pull_request.title",
		    		"type": "string",
		    		"required": false
	    		},
	    		{
		    		"name": "commit_hash",
		    		"path": "pull_request.head.sha",
		    		"type": "string",
		    		"required": false
	    		}
		    ]
    	}
    }'
    ```
    > Devopness authenticates webhook calls using [hash-based message authentication code (HMAC)](https://en.wikipedia.org/wiki/HMAC); in summary, a request is considered valid when it provides the header `<secret_header_name>` with the request body encoded using the `<secret_algorithm>` and a secret, provided to you by Devopness
1. From the previous command response, copy the field `url` and `secret`
    > `url` is the hook unique URL used to integrate with external services and `secret` is the signature key used to authenticate your webhook calls; this is the only time the secret' value will be returned as text, later operations will mask it

## Step 3: Ensure the webhook was created correctly

1. On your local machine, in a terminal window, run command to list all the pipeline webhooks, replacing `<pipeline_id>`.
    ```bash
    curl --request GET \
      --url https://api.devopness.com/pipelines/<pipeline_id>/hooks \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json'
    ```
1. In the previous command response, the recently created hook will be included in the list.
