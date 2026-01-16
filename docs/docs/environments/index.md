---
title: Environments
intro: Use environments to organize the infrastructure on which your application will run, provision new cloud resources, manage operating system resources, network configuration and have fine grained control of your application deployments.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

## How environments are used

An environment is where your infrastructure, deployments, and configuration live. It can include multiple servers, applications, and virtual hosts.

You can connect multiple repositories to the same environment by creating one application per repository. This is common when a product has:
- A marketing site
- A demo app
- A production app
- An API
- AI agents
- MCP servers

## When to split environments

Start with a single environment if you want to move fast and your teams, permissions, and release schedule are the same. Create another environment when you need separate domains, versions, data, or access rules (for example `Demo` and `Production`).

You can always add more environments later as your needs grow.
