---
title: Deploy Application using an Incoming Hook
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
  related:
  featured:
---

Use an incoming hook when you want a git event or other external event to trigger an application deploy.

This page is API-only today. Use the [Devopness API reference](/docs/api/index) and the webhook guide to create the hook that triggers a deploy pipeline.

## Goal

Trigger an application deploy when an external event reaches Devopness.

## Prerequisites

- The application already exists
- The deploy pipeline already exists
- You know the pipeline ID
- You have API access for webhook creation

## What you need

- The pipeline ID for the deploy pipeline
- The incoming webhook URL and secret from Devopness
- The event in your source provider that should call the webhook
- Access to your source provider's webhook settings

## How it works

- Create the incoming webhook in Devopness
- Copy the webhook URL and secret
- Add the webhook to your source provider
- Trigger the event
- Verify the deploy action appears in Devopness

## Using Devopness MCP

MCP is not available for creating incoming hooks.
Use the [create incoming webhook](/docs/webhooks/create-incoming-webhook) guide instead.

## Find the pipeline ID

Use the pipeline ID for the deploy pipeline that should run when the event arrives.

- Open the application pipeline details page and copy the ID from the URL, or use the API response if you already know the pipeline
- If you have not created the pipeline yet, add one first from the application pipeline pages

## Provider setup

Add the webhook in your git provider or automation tool.
The provider must send the event to the incoming hook URL that Devopness gives you.

## After you save

- The external source provider can call the incoming hook URL
- The deploy pipeline can start from the incoming webhook event

## Verify

- A trigger event creates a new deploy action in the application history
- The action log shows the incoming hook as the trigger source

## Common issues

- The webhook does not trigger anything: confirm the pipeline ID is correct
- The hook request fails: check the webhook URL, secret, and source provider settings
- The deploy starts but fails later: inspect the pipeline step logs

## What to do next

- Review the [Deploy Application](/docs/applications/deploy-application) page
- Configure an outgoing webhook if you want commit status updates back in your source provider
