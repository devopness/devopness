---
title: Add an Application
intro: Add applications to your infrastructure environments so they can be managed and deployed directly by web interface or through automated workflows
links:
    overview:
    quickstart:
    previous: servers/ssh-into-server
    next: pipelines/steps/add-step
    guides:
    related:
    featured:
required_permissions:
    - application:create
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. On the upper-right corner of the list click `ADD APPLICATION`
1. Select a `Source Provider`
1. Select a `Credential`
    > If no credential is listed or you want to use a different one, click `Create a new Credential` and follow the guide [/docs/credentials/add-credential]
1. Once a `Credential` is selected, select the git repository where the application source code is hosted
1. Follow the prompts then click `CONFIRM`
1. In the `Application` details view, the recently created `Application` details can be seen

## Multiple repositories in the same environment

You can add unlimited applications to the same environment, one per repository. This works well when your marketing site, demo app, production app, API, AI agents, and MCP servers belong to the same product and are managed by the same teams.

If you later need to separate demo and production (separate domains, versions, data, or access rules), create a new environment and deploy those applications there.

## Choose the right credential

For team workflows, prefer a shared automation account instead of a personal account.

Suggested setup:
1. Create a dedicated GitHub user (for example `devopness` or `devopness-<org>`)
1. Add it to your organization or repositories with the minimum permissions needed
1. Create a personal access token or SSH key for that user
1. Add the credential in Devopness and select it when adding the application

## Enable auto deployments on git push

To deploy automatically when you push commits, set up an incoming webhook in Devopness and connect it to your Git provider. This is currently done via the API (not the UI yet).

Steps:
1. Create an incoming webhook in Devopness
    - Follow the guide [/docs/webhooks/create-incoming-webhook]
1. Add a webhook in your GitHub repository using the incoming webhook URL and secret
1. Push a commit to verify the deployment triggers

## Keep apps running in the background

If your application is not managed by Docker Compose, add a daemon to keep it running and auto-restart it. For a Next.js application, the command is typically `npm run start`.

1. Add a daemon with the start command and working directory
    - Follow the guide [/docs/daemons/add-daemon]

## Redeploy after configuration changes

If you change configuration files (for example a `.env` file), run a new deployment so the updated configuration is applied. Follow the guide [/docs/pipelines/run-pipeline].
