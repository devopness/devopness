---
title: Add a File
intro: By adding configuration files you ensure a more consistent resource deployment, as they can contain crucial information and settings for each environment.
links:
    overview:
    quickstart:
    previous: /docs/pipelines/steps/add-step
    next: /docs/applications/link-server-to-application
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications find the application where you want to add a configuration file and click `DETAILS`
1. On the upper-right corner of the applications details view click `SETTINGS`
1. Use the drop-down menu to choose `CONFIGURATION FILE`
1. On the right corner of the list click `ADD CONFIGURATION FILE`
1. Follow the instructions in the add configuration file step form then click `CONFIRM`
    > A new deployment is required for your changes to take effect.
      - Follow the guide {% mentionPost "/docs/applications/deploy-application" %}
