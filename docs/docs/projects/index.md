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

Projects group all environments for one product, client, or stack.

## About

A project is where you organize work for one product or client.
Each project belongs to one organization.
A project can include multiple environments, apps, and resources.
You can start with one project and add another when your team grows.

## Who should use this

- Developers who ship multiple products
- Team leads who want each product to stay in one clear location
- Founders who want a simple permission model as the platform grows

Think of a project as one product or one client.
A startup can start one project that includes:

- one API
- one frontend
- one worker or queue process

At day 1, a project can start with one `Production` environment.
Add `Development` and `Staging` when your release flow grows.

## Relationship to organization

- Organizations hold all projects and team settings
- Keep related products inside one organization, then split by project when they have separate owners
- Each environment belongs to one project and holds deployable resources

## Start here

- Confirm the organization
- Create your first project
- Start with one `Production` environment
- Add `Development` or `Staging` when your release flow grows
- Add client or compliance-isolated work as separate projects, not extra ad-hoc environments

## Quick decision rule

Start with one project until one of these is true:

- You run separate unrelated products
- You need client-specific teams, permissions, or separate owners
- You need independent release schedules for different stacks or clients

## Practical example

- Team creates one project for API + frontend + workers at launch
- The same team adds another project for internal tooling after adding a second product owner
