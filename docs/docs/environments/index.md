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

An environment is a boundary for infrastructure, deployments, and configuration. It can include multiple servers, applications, and virtual hosts.

You can connect multiple repositories to the same environment by creating one application per repository. This is common when a product has:
- A marketing site (for example `www.my-product.ai`)
- A demo app (for example `demo.my-product.ai`)
- A backend service (for example `agent-server`)

## When to split environments

Start with a single environment if you want to move fast and your team, permissions, and release cadence are the same. Split environments when you need separate domains, versions, data, or access rules (for example `Demo` and `Production`).

You can always add more environments later as your needs grow.
