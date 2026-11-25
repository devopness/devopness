---
title: Deploy a Vite + React Application
resource_type: application
operation: deploy
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
  related:
    - files/add-file
    - virtual-hosts/add-virtual-host
    - applications/deploy-application-using-incoming-hook
  featured:
required_permissions:
  - application:deploy
---

Build a [Vite](https://vite.dev) + [React](https://react.dev) single-page application (SPA) into static production files (`dist/`) and deploy it to your Linux server.

On each deploy, Devopness installs dependencies, runs your Vite build inside a timestamped release folder (for example, `~/my-vite-app/releases/2026-06-15 13:45:10`), and updates `~/my-vite-app/current` to point to the latest release.

## Goal

Compile a Vite + React repository into static HTML, CSS, and JavaScript assets (`dist/`) and serve the application on a Linux server.

## Prerequisites

- A Devopness project and environment
- A connected Linux server with HTTP (`80`) and HTTPS (`443`) ports open
- A connected Git source provider (GitHub, GitLab, or Bitbucket) containing your Vite + React repository
- Your credential can read the target repository

## Deploy options

When creating or configuring your application in Devopness, set these fields:

- **Programming Language / Runtime:** Select **Node.js**
- **Build Command:** Set to `npm ci && npm run build` (or `npm install && npm run build` if `package-lock.json` is not committed)
- **Root Directory:** Leave as `/` unless your package manager file (`package.json`) is inside a subfolder

### Build-time environment variables (optional)

Vite embeds variables prefixed with `VITE_` into your JavaScript bundle during `npm run build`.

- Add a `.env` configuration file to your application with your `VITE_*` keys (for example, `VITE_API_URL=https://example.com`)
- Deploy again after adding or editing `.env` so Vite compiles the updated values into `dist/`

To create the `.env` file, see [Add a File](/docs/files/add-file).

## Using Devopness MCP

Try this prompt in Devopness MCP:

```text
Use Devopness MCP to create an application in https://devopness.com<project_id>/environments/<environment_id> and deploy <repo_url> following guidelines from https://devopness.com/docs/applications/deploy-vite-react-application
```

Incoming webhook creation is API-only, not available through MCP. Use the [API reference](/docs/api) and [Create an Incoming Webhook](/docs/webhooks/create-incoming-webhook) guide. For GitHub, set `secret_header_name` to `X-Hub-Signature-256`.

## Verify

You are done when:

- The deploy action reaches `completed`, not `failed` or stuck `pending`
- `~/application-name/current/dist` contains your compiled `index.html` and static asset files
- Your application loads in a browser at your server's IP address or domain name
- Client-side SPA routes (such as `/about`) load without returning a `404` error

## After deploy

- Add a Virtual Host in the same environment and configure routing to serve static files directly from your application's `dist` directory
- Configure an incoming webhook on your deploy pipeline to trigger deploys automatically on `git push`

See [Add a Virtual Host](/docs/virtual-hosts/add-virtual-host) for static directory routing details.

## Common issues

### Build fails with out-of-memory error on small VMs

Building Vite on servers with 1 GB RAM (such as AWS `t3.micro` or GCP `e2-micro`) can exhaust memory. Devopness SSH sessions log in as the non-root `devopness` user, so connect via SSH and run with `sudo` (or as `root`) to add 2 GB of swap space before deploying:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
```

### Updated environment variables do not appear after deploy

Vite injects `VITE_*` variables at build time, not runtime. Confirm your keys start with `VITE_` in `.env` and trigger a new deploy.

### Deploy succeeds but the site shows "Configured by Devopness!"

Confirm a **Virtual Host** is configured for your server IP or domain name and its routing points to your application's `dist` directory, then deploy again.

## What to do next

- [Add a Virtual Host](/docs/virtual-hosts/add-virtual-host)
- [Add an SSL Certificate](/docs/ssl-certificates/add-ssl-certificate)
- [Deploy Application using an Incoming Hook](/docs/applications/deploy-application-using-incoming-hook)
