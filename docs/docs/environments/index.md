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
  featured:
---

Environments define the deployment stages and runtime target for one project.

## About

Use environments to separate deployment flow, resource settings, and access levels inside one project.

Each environment is a named work area in one project.
Most teams start with `Production`, then add `Development` and `Staging`.
Each environment has its own credentials, resources, deployment settings, and team access.

## Start here

- Confirm you are in the right project
- Create a first `Production` environment
- Add `Development` and `Staging` when you need separate stages
- Add client or hotfix environments only when needed
  - Example: a security hotfix environment with separate credentials
  - Example: a staging environment for demoing work in progress

## When to split environments

Start with one `Production` environment while validating the first release.
Split environments when you need stronger isolation:

- Release moves through separate stages (`Development`, `Staging`, `Production`)
- Different credentials, web domains, and deployment permissions
- Temporary client-specific work or hotfix work that should not affect ongoing production releases
- Different infrastructure per team, region, or compliance requirement

## Examples

### Product company / Startup

- Start with one project in `Production` if you are validating a first version
- Add `Development`, `Staging`, or custom environments as the team grows
- Use each environment to test before moving work to production

### Agency or client specific custom software

- Start with your organization and one project per client
- One project per client can include `Production`, `Staging`, and custom environments
- Keep each client’s workflow separate from the others
- Use custom environments for one-off client changes without touching other releases

## Why this matters

- It reduces accidental changes across stages
- It makes it easier to decide what to test and deploy next
- It lets teams set safer access per stage
