---
title: Add a Pipeline
intro: By adding a pipeline to your environment's resources, you can automate their deployment by using customized pipeline steps.
links:
    overview:
    quickstart:
    previous:
    next: pipelines/steps/add-step
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications find the application where you want to add a pipeline and click the `NAME` of the application
1. Click the `Pipelines` tab
1. On the upper-right corner of the pipelines tab click `MANAGE`
1. Provide a name to the Pipeline being added. Example: "CI Pipeline"
1. Select an `Operation`
    > Don't use the `Custom` operation, it is not fully supported yet
1. Provide a value for the `Max parallel actions` field
1. Click `CONFIRM`
    > A new deployment is required for your changes to take effect.
      - Follow the guide [/docs/applications/deploy-application]
