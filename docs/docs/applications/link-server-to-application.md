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

Link one or more servers to an application so deploys can target the right machines.

## Goal

Choose or update which servers an application should deploy to when you need manual control.

On a first deploy, Devopness usually links a server for you when one is needed. Use this page when you want to add more servers, switch targets, or set the deploy destination explicitly.

## What you need

- Permission to update the application
- The application selected in the correct environment
- The server or servers that should receive deploys

## Examples

Try these examples in Devopness MCP:

- "Link the `web-1` server to `acme-web`"
- "Attach the production servers to the current application"
- "Link the staging server to the `acme-api` application"

## After you save

- The linked server appears in the application server list
- Future deploys can target the linked server

## Verify

- The server appears in the linked servers list
- The application can be deployed to that server

## Common issues

- The server does not appear in the list: confirm it belongs to the selected environment
- You cannot link the server: confirm you have update permission for the application
- The link disappears after refresh: check that the save action completed successfully

## What to do next

- [Deploy the application](/docs/applications/deploy-application) to use the current server set
- Add a [virtual host](/docs/virtual-hosts/add-virtual-host) if the app should be reachable on a domain name
- Add a [daemon](/docs/daemons/add-daemon) or [cron job](/docs/cronjobs/add-cronjob) if the application is private or scheduled
