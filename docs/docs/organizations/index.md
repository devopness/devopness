---
title: Organizations
intro: Organizations are the top-level workspace for your work in Devopness.
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

## About
- An organization is the top-level workspace in Devopness.
- It is a shared workspace for one company or legal entity
- Each organizations gets a unique readable URL slug (for example `acme` in `/@acme`).
- Personal accounts own organizations or can be invited to collaborate to organizations created by other users
- Organizations to group projects, teams and roles

## Who should use this
- Developers who want one clean workspace for shared projects.
- Team leads managing multiple products, clients, or teams.
- Founders who want predictable collaboration, visibility and productivity from day one.

## Organization vs Project
- Organization owns projects and sets the top-level permissions management (teams and roles).
- Project groups multiple related environments.
- Environment is a container for related cloud infrastructure resources, applications, SSL Certificates, Linux services, databases, etc

Think of it like this:
- **Organization:** your shared workspace, like `/@{slug}`
- **Project:** a bucket for one product or client
- **Environment:** stages inside that project, like `Development`, `Staging`, `Production`

## Why organizations exist
- They keep ownership and team activity in one place.
- They make team access and responsibilities easier to manage.
- They provide a predictable path to scale without changing product structure.

## Start here
- Create a new organization to secure your unique `/@{url_slug}`.
- Confirm it is the one where the project should live.
- Create your first project.
- Use `Teams` and invite members to collaborate in the organization
- Add `Roles` to manage delegated access permissions.

## Who can manage an organization
- Organization owners
- Team members with an organization role that allows managing organization settings
- Any member with project-level roles can work in project areas according to permissions.
- Any member with environment-level roles can contribute to specific environments

## Common questions at this level
- Can I see all projects from one place? Yes, when you are on the right organization.
- Why can't I edit org settings? Check your role and permission set first.

## Common issues
- You only see a subset of projects because your permissions are limited.
- You are looking at the wrong organization.
- You cannot edit organization settings because your role is not owner.

## Next
- Use [`Projects`](/docs/projects/) to create your first scoped workspace.
- Use [`Teams`](/docs/teams/) and [`Roles`](/docs/roles/) to define access.
