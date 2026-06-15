---
title: Link a server to an application
links:
  overview:
  quickstart:
  previous: applications/deploy-application
  next: virtual-hosts/add-virtual-host
  guides:
  related:
  featured:
required_permissions:
  - application:update
---

Choose which servers receive deploys for an application.

On first deploy, Devopness usually links a server automatically. Use this page when you need to add servers, change targets, or set the destination explicitly.

## Goal

Update the server list for an application.

## What you need

- Permission to update the application
- The application selected in the correct environment
- The server or servers that should receive deploys

## Using Devopness MCP

Try these prompts in Devopness MCP:

- "Link the `web-1` server to `acme-web`"
- "Attach the production servers to `acme-api`"
- "Link the staging server to the `acme-api` application"

## After you save

- The linked server appears in the application server list
- Future deploys can target the linked servers

## Verify

- The server appears in the linked servers list
- A deploy uses the servers you expect

## Common issues

- The server does not appear in the list: confirm it belongs to the selected environment
- You cannot link the server: confirm you have update permission for the application
- The link disappears after refresh: confirm the save completed

## What to do next

- [Deploy the application](/docs/applications/deploy-application)
- [Add a virtual host](/docs/virtual-hosts/add-virtual-host) when the app needs a public URL
- [Add a daemon](/docs/daemons/add-daemon) or [cron job](/docs/cronjobs/add-cronjob) for private or scheduled workloads
