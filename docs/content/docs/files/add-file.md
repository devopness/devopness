---
title: Add a File
intro: By adding configuration files you ensure a more consistent resource deployment, as they can contain crucial information and settings for each environment.
links:
    overview:
    quickstart:
    previous: pipelines/steps/add-step
    next: applications/link-server-to-application
    guides:
    related:
        - files/view-file
        - files/edit-file
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications, find the application to which you want to add a configuration and click the `NAME` of the application
1. Click the `CONFIGURATION FILES` tab
1. On the right corner of the configuration files tab click `MANAGE`
1. Follow the instructions in the add configuration file step form then click `CONFIRM`
    > A new deployment is required for your changes to take effect.
      - Follow the guide [/docs/applications/deploy-application]
