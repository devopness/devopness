---
title: Personal Access Tokens
links:
  overview:
  quickstart:
  previous: api-tokens/index
  next: api-tokens/personal-access-tokens/list-personal-access-tokens
  featured:
---

A Personal Access Token is a credential that authenticates to the Devopness API as a specific user.

It inherits the permissions of the user who owns it, so it can access resources and perform actions the same way that user can.

## About

- A Personal Access Token behaves like the owner, with the same capabilities and permissions
- It can work across all projects the user owns or is invited to as a team member
- It replaces a password for API authentication in scripts, local tooling, and automations

## Who this is for

- Developers who run scripts or CLI commands against the Devopness API
- Anyone integrating personal tooling with their own Devopness account
- Team members who need user-like access for one-off automations

## Why this exists

Personal Access Tokens give you a way to authenticate to the API without sharing your password, while keeping the access tied to your user identity and permissions.

## Relationship to other concepts

- **API Tokens** group both Personal Access Tokens and Project API Tokens
- **Project API Tokens** are scoped to a single project and are safer for shared or recurring automation
- **Roles and permissions** control what a token owner (and therefore the token) can do

## Which token should I use

Use a Personal Access Token when you need user-like access, such as quick scripts and personal tooling.
For service-to-service or shared automations, prefer a [Project API Token](/docs/api-tokens/project-api-tokens/index), which keeps the permission scope smaller.

## Start here

- [List Personal Access Tokens](/docs/api-tokens/personal-access-tokens/list-personal-access-tokens)
- [Add a Personal Access Token](/docs/api-tokens/personal-access-tokens/add-personal-access-token)
