---
title: Projects
intro: Projects group related environment stages of a product or client-specific environments
links:
  overview:
  quickstart:
  previous: organizations/index
  next: projects/add-project
  guides:
  related:
    - organizations/index
    - environments/index
  featured:
---

## About
Projects are where related applications and infrastructure resources live together.
Each project belongs to one organization and can start small.
A project can grow by adding `Development`, `Staging`, `Production`, and custom environments over time.

## Who should use this
- Developers who ship multiple products.
- Team leads separating ownership between products and teams.
- Founders who want a simple permission model as the platform grows.

Think of a project as one product family or one client delivery.
Example: a startup might create one project for an API, frontend, background workers, and queues.
At day 1, the same project can start with just a `Production` environment.
Later, add `Development`, `Staging`, and custom environments when you are ready.

## Relationship to organization
- Organizations own projects and team memberships.
- Keep product context inside the organization, then split by project when needed.
- Each environment belongs to a project and holds deployable resources.

## Start here
- Confirm the organization.
- Create your first project.
- Start with one project unless your have different unrelated products or client-specific environments
- Add `Development` or `Staging` environments when the release flow grows.

## When to create a new project
- You have different products, clients, or operational domain.
- Different teams need separate access boundaries.
- You need different credentials or release ownership for part of your work.

## When to keep one project
- One product has multiple environments (`Development`, `Staging`, `Production`) that share ownership.
- Your team needs a single place for related releases and team setup.
- You want simpler onboarding before splitting by ownership boundaries.

## Quick decision rule
Start with one project and expand when one of these becomes true:
- Teams, release ownership, or credentials should be separated.
- You need dedicated client-level boundaries.
- You need stronger project-level control than one workspace can provide.

Start with one project until one of these is true:
- Different products need separate ownership in practice.
- Credentials, permissions, or release ownership should be split.
- Teams should not all use the same project by default.
- You have special reasons to keep visibily, ownership and permissions management separated.

You can add more projects later without changing your current setup.

## Common issues
- You feel everything should be one project: this is fine to start.
- You are not sure where to split: split when team, credential, or release needs diverge.
- Too many environments inside one project too early can be slower than it sounds.
