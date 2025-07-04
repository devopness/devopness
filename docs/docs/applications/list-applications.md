---
title: List Applications
intro: View and manage all applications in your environment to monitor their status, deploy updates, or configure settings. The applications list provides a centralized view of all your applications with quick access to common actions.
links:
    overview:
    quickstart:
    previous: applications/index
    next: applications/view-application
    guides:
    related:
    featured:
required_permissions:
    - application:list
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`

## Understanding the Applications List

The applications list displays a table with the following information for each application:

- **NAME**: The name of the application
- **STACK**: The technology used by the application (e.g., HTML (static))
- **REPOSITORY**: The link to the application's GitHub repository
- **CURRENT VERSION**: The current version with commit hash and branch (e.g., 7c56a92a (master))
- **LAST ACTION STATUS**: Status of the last deployment (e.g., Completed (Deploy))
- **DEPLOY**: Quick action button to deploy the application

## Available Actions

From the applications list page, you can perform the following actions:

- **ACTIONS**: Button in the upper-right corner for additional options
- **ADD APPLICATION**: Highlighted button in the upper-right corner to add a new application
- **DEPLOY**: Button on each application row to initiate a deployment
- **View Application Details**: Click on an application name to view its complete details
- **Help**: Question mark (?) button in the upper-right corner to access this documentation

:::note

Applications with recent failed deployments will show a red status indicator, allowing you to quickly identify issues that need attention.

:::
