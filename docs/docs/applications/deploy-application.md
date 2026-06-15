---
title: Deploy Application
links:
  overview:
  quickstart:
  previous: files/add-file
  next: virtual-hosts/add-virtual-host
  guides:
  related:
  featured:
required_permissions:
  - application:deploy
---

Run the deploy pipeline to build your code and release it to your servers.

On first deploy, Devopness links a server automatically when one is needed.
Each deploy creates a new timestamped release folder on the server, for example `~/acme-api/releases/2026-06-15 13:45:10`, and updates `~/acme-api/current` to point to the latest successful release.

## Goal

Run the deploy pipeline for an application branch, tag, or commit.

## Prerequisites

- You can deploy applications in this environment (`application:deploy`)
- The application already exists in the selected environment
- Your [credential](/docs/credentials/add-credential) can still read the repository
- **Root directory** and build settings match your repository layout
- Configuration files such as `.env` are in place if your app needs them. See [Add a file](/docs/files/add-file)

## Before you deploy

- Confirm your configuration files are in place if your app needs them. Example: a `.env` file

## Deploy options

Use these fields when confirming a deploy in the web app.

### Branch, tag, or commit

The git ref to deploy.
If you leave this blank, Devopness uses the application's **default branch**.

### Pipeline

The deploy pipeline to run.
Use the default pipeline unless you maintain multiple pipelines for the same application.

### Target servers

Which servers receive this deploy.
When omitted, Devopness uses the application's servers, including any linked automatically on a previous deploy.

### Deployment type

How the release is applied, such as a standard deploy or rollback.
Available values depend on your pipeline configuration.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Deploy the `acme-api` application in Production using branch `main`."
- "Deploy `acme-web` to Staging and tell me when the deploy action completes."
- "List recent deploy actions for `acme-worker` in Production and redeploy the last successful branch."

## Verify

- The deploy action reaches `completed`, not `failed` or stuck `pending`
- The server has a new timestamped release folder under `~/application-name/releases/`
- `~/application-name/current` points to the latest successful release
- For a **public** app: it responds on a [virtual host](/docs/virtual-hosts/add-virtual-host) or server IP, not the default **Configured by Devopness! 🚀** landing page
- For a **private** worker: the process is running via your [daemon](/docs/daemons/add-daemon) or [cron job](/docs/cronjobs/add-cronjob) if you set one up
- The deployment appears in history with the expected branch or commit

## After you deploy

**Public API or web app**

- [Add or update a virtual host](/docs/virtual-hosts/add-virtual-host) and point DNS to your server
- Test over the internet via your domain or server IP

**Private worker or background job**

- Add a [daemon](/docs/daemons/add-daemon) to keep the process running and restart it on failure
- Add a [cron job](/docs/cronjobs/add-cronjob) for scheduled tasks from your application code
- No virtual host is required

**Any application**

- If you changed `.env` or other config files, deploy again so servers pick up the update
- [Set up deploy on git push](/docs/applications/deploy-application-using-incoming-hook) when you want automatic releases

## What this looks like on your server

Devopness keeps each deploy as a separate release folder, so you can roll forward or roll back without overwriting the previous release.

- `~/application-name/releases/<YYYY-MM-DD HH:MM:SS>` contains each deploy release
- `~/application-name/current` points to the live release of the application
- The current release is the last successful build that Devopness activated on the server

## Common issues

### Deploy fails at `Get source from Git repository`

- Confirm **Root directory** points to the folder with your package manager file (`package.json`, `composer.json`, `Gemfile`, `pom.xml`, etc.)
- Confirm the credential is active and can read the repository
- Read the failed action step logs

### Deploy keeps failing on the same step

- Read the logs for that pipeline step
- Update the install dependencies or build command if your stack changed
- Confirm repository access on the git host

### Deploy succeeds but the site shows "Configured by Devopness! 🚀"

This usually applies to **public** apps that still need routing:

- [Add or update a virtual host](/docs/virtual-hosts/add-virtual-host)
- Set the virtual host document root to your public output folder (`public`, `build`, `dist`, etc.)
- Redeploy the virtual host or deploy the application again

## What to do next

- [Add a Virtual Host](/docs/virtual-hosts/add-virtual-host): for public APIs and web apps
- [Add a daemon](/docs/daemons/add-daemon): for long-running background processes
- [Deploy using an Incoming Hook](/docs/applications/deploy-application-using-incoming-hook): trigger deploys from git events
