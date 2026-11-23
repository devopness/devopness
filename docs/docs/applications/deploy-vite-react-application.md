---
title: Deploy a Vite + React Application
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

On each deploy, Devopness installs dependencies, runs your Vite build inside a new timestamped release folder (for example, `~/my-vite-app/releases/2026-06-15 13:45:10`), and updates `~/my-vite-app/current` to point to the latest successful build.

## Goal

Compile a Vite + React repository into static HTML, CSS, and JavaScript assets (`dist/`) and serve the application on a Linux server.

## Prerequisites

- A Devopness project and environment
- A connected Linux server with HTTP (`80`) and HTTPS (`443`) ports open
- A connected Git source provider (GitHub, GitLab, or Bitbucket) containing your Vite + React repository
- Your credential can read the target repository

## Deploy options

When creating or configuring your application in Devopness, set these fields:

### Programming Language / Runtime

Select **Node.js**.

### Build Command

Set the build command to install dependencies and compile the static production bundle:

```bash
npm ci && npm run build
```

If your repository does not commit a `package-lock.json` file, use `npm install && npm run build`.

### Root Directory

Leave as `/` unless your `package.json` file is inside a subfolder of the repository.

### Build-time environment variables (optional)

Vite embeds variables prefixed with `VITE_` directly into the compiled JavaScript bundle during `npm run build`.

- [Add a File](/docs/files/add-file) named `.env` to your application with your `VITE_*` keys (for example, `VITE_API_URL=https://example.com`)
- Deploy the application again whenever you add or edit `.env` so Vite compiles the updated values into `dist/`

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "In organization `ORG_NAME`, project `PROJECT_NAME`, and environment `ENVIRONMENT_NAME`, create a Node.js application named `my-vite-app` from repository `OWNER/REPO` on branch `main` with build command `npm ci && npm run build`."
- "Add a `.env` configuration file to `my-vite-app` with `VITE_API_URL=https://example.com`, create a Virtual Host on `SERVER_IP_OR_DOMAIN` serving the static `dist` directory, and deploy `my-vite-app`."

Incoming webhook creation is API-only, not available through MCP. Use the [API reference](/docs/api) and [Create an Incoming Webhook](/docs/webhooks/create-incoming-webhook) guide. For GitHub, set `secret_header_name` to `X-Hub-Signature-256`.

## Verify

- The deploy action reaches `completed`, not `failed` or stuck `pending`
- `~/application-name/current/dist` contains your compiled `index.html` and static asset files
- Your application loads in a browser at your server's public IP address or domain name
- Client-side SPA routes (such as `/about`) load without returning a `404` error

## After you deploy

### Expose your application over HTTP/HTTPS

Add a **Virtual Host** in the same environment so Nginx serves your compiled `dist/` directory:

- Choose **Server IP address** for quick testing or **Domain name** for a custom domain with a DNS `A` record pointing to your server
- Set routing to serve static files directly from your application's `dist` directory rather than proxying a localhost port

### Automatic deploys on git push

- Configure an incoming webhook on your application's deploy pipeline to trigger releases automatically when you push to your target branch

## Common issues

### Build fails with out-of-memory error on small VMs

Running `npm run build` with Vite on servers with 1 GB RAM (such as AWS `t3.micro` or GCP `e2-micro`) can exhaust available memory. Connect to your server via SSH and run the following commands with `sudo` (or as `root`, since Devopness SSH sessions log in as the non-root `devopness` user) to enable at least 2 GB of swap space before deploying:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
```

### Updated environment variables do not appear after deploy

Vite injects `VITE_*` variables at build time, not at runtime.

- Confirm your keys start with `VITE_` in your `.env` configuration file
- Trigger a new deploy after saving `.env` so Vite rebuilds `dist/`

### Deploy succeeds but the site shows "Configured by Devopness!"

- Confirm a **Virtual Host** is configured for your server IP address or domain name
- Confirm the Virtual Host routing points to your application's `dist` directory, then deploy again

## What to do next

- [Add a Virtual Host](/docs/virtual-hosts/add-virtual-host): serve your static `dist` output over a server IP or custom domain
- [Add an SSL Certificate](/docs/ssl-certificates/add-ssl-certificate): enable HTTPS on your Virtual Host
- [Deploy Application using an Incoming Hook](/docs/applications/deploy-application-using-incoming-hook): trigger deploys automatically from git events
