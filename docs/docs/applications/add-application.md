---
title: Add an Application
links:
  overview:
  quickstart:
  previous: servers/add-server
  next: applications/deploy-application
  guides:
  related:
  featured:
required_permissions:
  - application:create
---

Connect a git repository to this environment so Devopness can build and deploy it.

## Goal

Add the application before you deploy it.

## Prerequisites

- You can create applications in this environment (`application:create`)
- The target project and environment are already selected
- A [credential](/docs/credentials/add-credential) that can read the repository on your git host

## What you need

### Source provider

The git host where the repository lives, such as GitHub, GitLab, or Bitbucket.
It must match the host used by the credential.

### Credential

The OAuth token or access token Devopness uses to clone and read the repository.
If the list is empty, [create a credential](/docs/credentials/add-credential) first.

### Repository

The repository name in `owner/name` format, for example `acme/api`.
If the code lives inside a monorepo, set **Root directory** to the folder you want Devopness to build.

### Name

The short name for this application in the environment.
This is the name shown in lists and deploy logs.

### Programming language, framework, and engine version

The stack Devopness uses to choose default pipeline steps and runtime settings.
Examples: Laravel, Django, FastAPI, Spring Boot, Rails, ASP.NET, Express.

### Root directory

The folder inside the repository that contains the package manager file for this application, such as `package.json`, `composer.json`, `Gemfile`, `pom.xml`, or `pyproject.toml`.
Use the subfolder where that file lives. Use `/` only when the file is at the repository root.

### Default branch

The branch Devopness uses when a deploy does not specify another ref (usually `main` or `master`).

### Install dependencies command / Build command

Optional overrides for how Devopness installs packages and builds artifacts during deploy.
Leave the defaults unless your stack needs custom commands.

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In project `acme-platform`, Production environment, add an application from GitHub repo `acme/api` using my `acme-github` credential."
- "List applications in Staging, then add the worker repo `acme/worker` with root directory `/apps/worker` and default branch `main`."
- "Add a Laravel app from `acme/billing` to Production with the suggested PHP framework settings."

## After you save

1. [Deploy the application](/docs/applications/deploy-application). Devopness links a server on first deploy when needed
2. Then (optional):
   - **Background worker or scheduled job:** add a [daemon](/docs/daemons/add-daemon) or [cron job](/docs/cronjobs/add-cronjob)
3. Optional: customize the [deploy pipeline](/docs/pipelines/add-pipeline) or set up [deploy on git push](/docs/applications/deploy-application-using-incoming-hook)

## Verify

- The application appears in the environment list with the expected name and repository
- The repository and credential match the git host you selected
- The root directory points to the folder that contains your package manager file

## What to consider

### Multiple applications in the same environment

Add one application per service when that matches how you release code.
This works when your API, frontend, worker, docs site, or SDK share the same environment but need different deploy settings.

Create a new environment when you need separate infrastructure, data, access rules, or release cadence.

### Public vs private applications

- **Public** (API, web app, marketing site): deploy
- **Private** (queue worker, internal processor): deploy, then add a [daemon](/docs/daemons/add-daemon) or [cron job](/docs/cronjobs/add-cronjob)

### Redeploy after configuration changes

If you change code or deploy settings, [deploy again](/docs/applications/deploy-application) so servers pick up the update.

## Common issues

- **No credential in the list:** [create one](/docs/credentials/add-credential) for the same source provider
- **Repository not listed:** confirm the credential has access to that repo on the git host
- **Deploy fails later at clone step:** check **Root directory** points to the folder with your package manager file
- **You do not see Add Application:** confirm you have `application:create` for this environment

## What to do next

- [Deploy Application](/docs/applications/deploy-application)
