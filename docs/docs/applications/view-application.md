---
title: View Application Details
intro: Access detailed information about a specific application, including its configuration, deployment history, and linked resources. The application details page provides comprehensive management options for a single application.
links:
    overview:
    quickstart:
    previous: applications/list-applications
    next: applications/edit-application
    guides:
    related:
    featured:
required_permissions:
    - application:view
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. Click on the name of the application you want to view

## Application Details Overview

The application details page provides information organized in tabs and sections:

### Navigation Tabs
The page contains several tabs to access different aspects of the application:
- **Details**: Basic application information (shown by default)
- **Pipelines**: Pipeline configurations related to the application
- **Servers**: Servers linked to the application
- **Virtual Hosts**: Virtual host configurations
- **Daemon**: Configured daemon services
- **Services**: Services associated with the application
- **Cron Jobs**: Scheduled tasks configuration
- **Variables**: Environment and configuration variables
- **Configuration Files**: Custom configuration files

### Application Details Section
- **Name**: The name of the application
- **Stack**: Technology used (e.g., HTML (static))
- **Repository**: Link to the GitHub repository with corresponding icon
- **Current Version**: Current commit hash and branch (e.g., 7c57a90a (master))
- **Credential**: GitHub credential used to access the repository
- **Virtual Hosts**: URLs and ports where the application is available

### Deployment Section
- **Install Dependencies Command**: Command to install dependencies
- **Build Command**: Command to build the application
- **Root Directory**: Application root directory
- **Default Branch**: Default branch used for deployments (e.g., main)
- **Deployments To Keep**: Number of previous deployments kept in history
- **Last Action Status**: Status of the last deployment
- **Created/Updated At**: Creation and last update date and time
- **Created By**: User who created the application

### Available Actions
From the application details page, you can:

- **DEPLOYMENTS**: Button to view history of previous deployments
- **DEPLOY**: Blue highlighted button to start a new deployment
- **ACTIONS**: Dropdown menu with additional actions
- **EDIT**: Button to edit application settings
- **REMOVE**: Button to remove the application (requires confirmation)
- **Help**: Question mark (?) button to access this documentation

### Special Sections
- **ADD DAEMON**: Link to add a new daemon service to the application
- Creation and update date/time information
- Details of the user who created the application

:::tip

Use the tabs at the top of the page to navigate between different aspects of the application. Each tab provides specific controls for managing different features of your application.

:::

:::warning

Removing an application will delete its configuration from Devopness but won't affect your source code repository. However, the application will no longer be managed or deployed by Devopness after removal.

:::
