---
title: Environments
intro: Environments define the stages inside a project.
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

## About
Environments are named work areas inside one project.
They are usually `Development`, `Staging`, and `Production`.
Each environment holds apps, servers, and settings used in that stage.

## Start here
- Confirm you are in the right project.
- Create a first `Production` environment.
- Add `Development` and `Staging` when you need separate stages.
- Add client or hotfix environments only when needed.

## When to split environments
Start with one `Production` environment while validating the first release.
Add more environments when isolation is needed for one of these reasons:
- separate release flow (`Development`, `Staging`, `Production`)
- different credentials, web domains, deployment permissions;
- temporary client-specific work (or hotfix) that should not affect ongoing production releases.

## Examples
### Product company / Startup
- Start with one project in `Production` if you are validating a first version.
- Add `Development`, `Staging`, or custom environments as the team grows.

### Agency or client specific custom software
- Start with your organization and one project per client.
- One project per client can include `Production`, `Staging`, and custom environments.
- Keep each client’s workflow separate from the others.

## Why this matters
- It reduces accidental changes across stages.
- It makes it easier to decide what to test and deploy next.
- It lets teams set safer access per stage.

## Common issues
- You added too many environments too soon.
- You can no longer tell which environment is used for what.
- A production-safe path should use separate stages for risky changes.
