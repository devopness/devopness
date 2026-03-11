---
title: Organizations
links:
  overview:
  quickstart:
  previous:
  next: projects/index
  guides:
    related:
    - projects/index
    - teams/index
    - roles/index
  featured:
---

Organizations are the top-level workspace where you group teams, roles, and projects in Devopness.

## About

- An organization is a dedicated workspace for one company, legal entity, or client portfolio
- Every organization has a readable URL slug, like `acme` in `/@acme`
- Members join through ownership, invitation, or team membership
- It is the first place where team access and project ownership are set

## Who should use this

- Developers who want one clean workspace for shared projects
- Team leads managing multiple products, clients, or teams
- Founders who want a predictable setup before adding many environments

## Organization vs Project

- Organizations hold one or more projects
- A project groups environments for one product or client
- An environment is a container for deployable resources, such as an app, server setup, or data store

Think of it like this:

- **Organization:** the shared folder for everyone in one workspace, like `/@acme`
- **Project:** one product or client inside that workspace
- **Environment:** one stage inside that project, like `Development`, `Staging`, `Production`

## Why organizations exist

- They keep teams, roles, and projects in one place
- They give founders one place to control who can see and change what
- They let the workspace grow from one project to many without redesigning structure

## Start here

- Create your first organization and get a stable `/@{slug}`
- Confirm it is the one where the project should live
- Create your first project
- Use `Teams` and invite members to collaborate in the organization
- Add `Roles` to manage delegated access permissions

## Who can manage an organization

- Organization owners
- Team members with an organization role that allows managing organization settings
- Members with project roles can work in project areas
- Members with environment roles can contribute to specific environments

## Typical setup flow

- Start with one organization for the main legal entity or one agency account
- Add one project per major product, portfolio, or client
- Use separate environments (`Production`, `Staging`, `Development`) inside each project

## Common questions at this level

- Can I see all projects in one place? Yes, by selecting the right organization
- Why can't I edit org settings? Check your role and permissions first

## Next

- Use [`Projects`](/docs/projects/) to create your first workspace
- Use [`Teams`](/docs/teams/) and [`Roles`](/docs/roles/) to define access
