---
title: Environments
links:
  overview:
  quickstart:
  previous: projects/index
  next: environments/add-environment
  guides:
    - environments/list-environments
  related:
    - projects/index
    - applications/index
  featured:
---

An **environment** is a separate infrastructure setup inside one project. Each environment has its own servers, applications, credentials, files, pipelines, and access rules. Nothing in one environment is shared automatically with another.

Names like `Development`, `Staging`, and `Production` are common, but an environment is not just a label: dev might run on one or two servers while production runs on twenty servers behind a load balancer, or on serverless infrastructure in the cloud.

You can also name an environment after a client when you manage separate infrastructure per client, for example `customer-acme` or `customer-abc`.

## About

- Use environments when you need fully independent infrastructure inside one project
- Resources in one environment (servers, applications, SSH keys, daemons, cron jobs, virtual hosts, credentials) do not exist in another unless you create them there
- Most teams deploy to dev first, then move stable work to staging and production
- Each environment can scale differently: smaller setups for testing, larger setups for live traffic

## Who this is for

- Teams that need separate dev, staging, and production infrastructure
- Operators who need different servers, credentials, or access per release flow
- Founders who want one project with isolated dev and production setups

## Think of it like this

- **Project:** one product or client
- **Environment:** a separate copy of infrastructure for that product (its own servers and applications)
- **Application:** one git repository connected to that environment

## Start here

- Confirm you are in the right project
- Create a first `Production` environment
- Add `Development` and `Staging` when you need separate infrastructure and release flow
- [Add applications](/docs/applications/add-application) in each environment
- Add client or hotfix environments only when needed
  - Example: a security hotfix environment with separate servers and credentials
  - Example: a staging environment for demoing work in progress

## When to split environments

Start with one `Production` environment while validating the first release.
Add another environment when you need stronger isolation:

- You want a safe place to test before production (dev or staging)
- Different credentials, domains, or deployment permissions per setup
- Different servers, applications, or supporting resources (one dev server vs many production servers)
- Temporary client-specific or hotfix work that must not affect production
- Different infrastructure per team, region, or compliance requirement

## Common setups

### Product company or startup

- Start with one `Production` environment if you are validating a first version
- Add `Development`, `Staging`, or custom environments when you need separate infrastructure
- Deploy to dev first, validate, then move stable work to staging and production

### Agency or client-specific software

- Start with your organization and one project per client
- One project per client can include `Production`, `Staging`, and custom environments
- Keep each client's workflow separate from the others
- Use custom environments for one-off client changes without touching other releases

## Why this matters

- It reduces accidental changes across dev, staging, and production
- It makes it easier to decide what to test and deploy next
- It lets teams set safer access per environment
- It keeps infrastructure, applications, and credentials isolated when you need a clean separation

## What to do next

- Add your first [environment](/docs/environments/add-environment)
- Review [Projects](/docs/projects/) if you still need to create the parent project
- [Add applications](/docs/applications/add-application) inside the environment
