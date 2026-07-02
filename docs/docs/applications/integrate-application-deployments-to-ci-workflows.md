---
title: Integrate Application deployments with your Continuous Integration (CI) workflows
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
  related:
  featured:
---

Use an outgoing hook when you want Devopness to report deploy progress back to your source provider or CI system.

This page is API-only today. Use the [/docs/api] to create outgoing hooks that update commit status in your source provider.

## Goal

Keep source provider commit status in sync with application deploy actions.

## Prerequisites

- The application already has a deploy pipeline
- You know the pipeline ID
- You have API access for webhook creation
- You know the commit status format required by your source provider

## What you need

- The pipeline ID for the deploy pipeline
- The target URL that your source provider should call
- The request headers required by the source provider
- The request body shape required by the source provider

## How it works

- Devopness emits action events for the deploy pipeline
- Your outgoing hook sends a status update to the provider
- The provider updates the commit status for the same commit

## Using Devopness MCP

MCP is not available for creating outgoing hooks.
Use the [create outgoing webhook](/docs/webhooks/create-outgoing-webhook) guide and the source provider API docs below:

- [Bitbucket commit statuses](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-commit-statuses/#api-repositories-workspace-repo-slug-commit-commit-statuses-build-post)
- [GitHub commit statuses](https://docs.github.com/en/rest/commits/statuses#create-a-commit-status)
- [GitLab commit statuses](https://docs.gitlab.com/ee/api/commits.html#set-the-pipeline-status-of-a-commit)

## Minimal request

Use the API reference and the outgoing webhook guide to fill in the provider-specific body. A minimal request looks like this:

```bash
curl --request POST \
  --url https://api.devopness.com/pipelines/<pipeline_id>/hooks/outgoing \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer <your_api_token>' \
  --header 'Content-Type: application/json' \
  --data '{ ... }'
```

## After you save

- The source provider can show deploy progress for the selected commit
- The same context value should be reused so each status updates the same entry

## Find the pipeline ID

Use the pipeline ID for the deploy pipeline that emits the action events.

- Open the application pipeline details page and copy the ID from the URL, or use the API response if you already know the pipeline
- If you have not created the pipeline yet, add one first from the application pipeline pages

## Verify

- The source provider shows the expected commit status for the deploy action
- The status links back to the Devopness action details page
- The same commit status entry updates as the action moves through its states

## Common issues

- The status never updates: confirm the pipeline ID and hook URL are correct
- The source provider rejects the request: confirm the headers and body match its API
- Each status creates a new entry: reuse the same `context` value for every event

## What to do next

- Create the matching [incoming hook](/docs/applications/deploy-application-using-incoming-hook) if you also want deploys to start from source control events
- Review the [Outgoing webhook](/docs/webhooks/create-outgoing-webhook) guide for request details
