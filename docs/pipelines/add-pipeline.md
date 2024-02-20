---
title: Add a Pipeline
intro: By adding a pipeline to your environment's resources, you can automate their deployment by using customized pipeline steps.
links:
    overview:
    quickstart:
    previous:
    next: /docs/pipelines/steps/add-step
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications find the application where you want to add a pipeline and click in the `NAME` of the application
1. On the left corner of the list click `PIPELINES`
1. On the right corner of the list click `MANAGE`
1. Provide a name for the new pipeline
1. Select the operation
    > Don't use the `CUSTOM` operation, it is not fully supported yet
1. Provide the max parallel instances
1. Click `CONFIRM`
    > A new deployment is required for your changes to take effect.
      - Follow the guide {% mentionPost "/docs/applications/deploy-application" %}
