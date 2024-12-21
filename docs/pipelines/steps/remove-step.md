---
title: Remove Step from Pipeline
intro: Learn how to remove a step from a pipeline when it's no longer needed
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card, to see a list of existing `Applications`
1. In the list of applications, find the application with the pipeline you want to manage and click the `NAME` of the application
1. Click the `Pipelines` tab
1. In the list of pipelines, find the pipeline you want to manage and click the `NAME` of the pipeline
1. On the upper-right corner of the pipeline details view, click `STEPS` to see a list of existing pipeline steps
1. In the list of pipeline steps, find the pipeline step you want to remove and click `REMOVE`
1. Follow the prompts then click `REMOVE`
1. In the list of pipeline steps, the recently removed `Step` will be gone
    > A new deployment is required for your changes to take effect.
      - Follow the guide [/docs/applications/deploy-application]
