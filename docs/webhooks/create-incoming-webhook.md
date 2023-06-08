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
engrish

At Devopness we treat our `API-as-a-Product`, meaning that every feature in our product is first designed with the API usage in mind, resulting in an API that is easy to use, well documented and actively maintained and supported.

This `API-first` development approach makes it possible that every piece of functionality available to users of our web app can also be automated and integrated with external systems.

Devopness webhooks are a highly performant way to allow applications to push data from external events to trigger pipelines on your infrastructure environments, increasing productivity and reliability while working on cloud applications and infrastructure management workflows.

Webhooks, for now, are an API only feature; so this post will guide you through the usage of our API to help you create a webhook.

1. Copy the `Application ID` (`<application_id>`) and `Deploy Pipeline ID` (`<pipeline_id>`) from the application which you want to run pipelines programatically
    > Follow the [Deploy Application using an Incoming Hook](/docs/applications/deploy-application-using-incoming-hook) guide for detailed instructions
1. In a terminal window, submit a request to Devopness API endpoint `POST /users/login` using your Devopness account email and password
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
1. In a terminal window, submit a request to Devopness API endpoint `POST /hooks/incoming`, replacing `<application_id>` and `<pipeline_id>`.
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
    > Devopness authenticates webhook calls using [hash-based message authentication code (HMAC)](https://en.wikipedia.org/wiki/HMAC); in summary, a request is considered valid when it provides the header `<secret_header_name>` with the request body encoded using the `<secret_algorithm>` and a secret, provided to you by Devopness
1. From the previous command response, copy the field `url` and `secret`
    > `url` is the hook unique URL used to integrate with external services and `secret` is the signature key used to authenticate your webhook calls; this is the only time the secret' value will be returned as text, later operations will mask it
1. In a terminal window, run command to list all the application hooks, replacing `<application_id>`.
    ```bash
    curl --request GET \
      --url https://api.devopness.com/applications/<application_id>/hooks \
      --header 'Accept: application/json' \
      --header 'Authorization: Bearer <access_token>' \
      --header 'Content-Type: application/json'
    ```
1. In the previous command response, the recently created hook will be included in the list.
