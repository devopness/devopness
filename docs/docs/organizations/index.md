---
title: Organizations
links:
  overview:
  quickstart:
  previous:
  next: projects/index
  guides:
    - projects/index
    - teams/index
    - roles/index
  featured:
---

An **organization** is the top level in Devopness. It groups projects, teams, roles, and access settings.

## About

- An organization is for one company, legal entity, or client portfolio
- Every organization has a URL slug, like `acme` in `/@acme`
- People join through invitation or team membership
- Projects, teams, and access rules are set at this level

## Who this is for

- Developers who need one place for shared projects
- Team leads managing multiple products, clients, or teams
- Founders setting up Devopness before adding environments and applications

## Devopness hierarchy

- **Organizations** hold one or more **projects**
- **Projects** group environments and resources for one product or client
- **Environments** are independent infrastructure inside a project (each with its own servers, applications, credentials, and configuration)
- **Applications** connect one git repository (or one folder in a monorepo) to one environment

Think of it like this:

- **Organization:** one company or agency in Devopness, like `/@acme`
- **Project:** one product or client inside that organization
- **Environment:** a separate infrastructure setup inside that project, such as `Development`, `Staging`, or `Production`. Dev might use one server; production might use many servers, load balancers, or serverless resources
- **Application:** your API, web app, or worker in that environment, linked to a git repository

## Why this exists

- Teams, roles, and projects live in one organization
- Owners control who can see and change what
- You can add more projects later without changing the overall structure

## Start here

- Create your first organization and get a stable `/@{slug}`
- Confirm it is the one where the project should live
- Create your first [project](/docs/projects/)
- Add an [environment](/docs/environments/), then [applications](/docs/applications/) inside it
- Use [Teams](/docs/teams/) to invite members
- Add [Roles](/docs/roles/) to control access

## Who can manage an organization

- Organization owners
- Team members with an organization role that allows managing organization settings
- Members with project roles can work in project areas
- Members with environment roles can contribute to specific environments

## Typical setup flow

- Start with one organization for the main legal entity or one agency account
- Add one project per major product, portfolio, or client
- Inside each project, add environments (`Production`, `Development`, `Staging`, or custom names) as separate infrastructure
- Add [applications](/docs/applications/) per environment. Deploy to dev first, then move stable work to staging and production

## Common questions

- Can I see all projects in one place? Yes, select the organization first
- Why can't I edit org settings? Check your role and permissions

## What to do next

- [Projects](/docs/projects/)
- [Teams](/docs/teams/) and [Roles](/docs/roles/)
