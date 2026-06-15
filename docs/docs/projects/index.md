---
title: Projects
links:
  overview:
  quickstart:
  previous: organizations/index
  next: projects/add-project
  guides:
    - organizations/index
    - environments/index
  featured:
---

A **project** in Devopness groups everything for one product or one client inside an organization: environments, applications, teams, and access settings.

Use one project per product or client. Do not mix unrelated products in the same project.

## Think of it like this

- **Organization:** your company or agency account, like `/@acme`
- **Project:** one product or client inside that organization
- **Environment:** separate infrastructure inside the project (dev, staging, production)
- **Application:** one git repository connected to one environment

## About

- Each project belongs to one organization
- A project holds one or more environments, and each environment has its own servers, applications, credentials, and configuration
- You can start with one project and add another when you add a second product or a new client

## Who this is for

- Developers who work on more than one product
- Team leads who want each product in one clear location
- Founders who want simple permissions as the team gets bigger

## Why this exists

Projects keep related environments and applications together.
They also keep unrelated products or clients separate, so permissions and releases stay clear.

## Relationship to other concepts

- **Organizations** hold all projects and organization-wide team settings
- **Environments** inside a project are fully independent: dev might use one or two servers; production might use many servers, load balancers, or serverless infrastructure
- **Applications** live inside one environment each: one git repository (or monorepo folder) with its own deploy settings

## Practical example

A startup creates one project for their main product:

- `Production` environment with three applications: `acme/api`, `acme/web`, `acme/worker`
- Later adds `Development` and `Staging` with their own servers and applications
- Adds a second project for internal tooling when a new product owner joins

## First setup path

If you already have an organization:

1. [Add a project](/docs/projects/add-project)
2. [Add an environment](/docs/environments/add-environment), starting with `Production` or `Development`
3. [Add applications](/docs/applications/add-application) in that environment
4. Deploy to dev first, then move stable work to staging and production

## Quick decision rule

Start with one project until one of these is true:

- You run separate unrelated products
- You need client-specific teams, permissions, or separate owners
- You need independent release schedules for different stacks or clients

Use separate **projects** for separate products or clients, not extra environments inside one project.

## Common questions

- **One project or many?** One project per major product or client is a good starting point
- **Project vs environment?** Use environments for dev, staging, and production inside one product. Use projects when the product or client is different
- **What goes in a project name?** Use a name your team knows, such as the product or client name

## Start here

- [Add a project](/docs/projects/add-project)
- [List projects](/docs/projects/list-projects)
- [Environments](/docs/environments/)
