---
title: Add Step to Pipeline
intro: Add a pipeline step to perform a specific task in a defined order during the resource deployment process of your pipeline.
links:
    overview:
    quickstart:
    previous: /docs/applications/add-application
    next: /docs/files/add-file
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications find the application with the pipeline you want to manage and click `DETAILS`
1. On the upper-right corner of the applications details view click `SETTINGS`
1. Use the drop-down menu to choose `PIPELINES`
1. In the list of pipelines, find the pipeline you want to manage and click `DETAILS`
1. On the upper-right corner of pipeline details view click `STEPS`
1. On the upper-right corner of the list click `ADD STEP`
1. Follow the instructions in the add pipeline step form then click `CONFIRM`
    > A new deployment is required for your changes to take effect.
      - Follow the guide {% mentionPost "/docs/applications/deploy-application" %}
