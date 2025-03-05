---
title: Add a Variable
pagination_prev: pipelines/steps/add-step
pagination_next: applications/link-server-to-application
required_permissions:
    - application:update
---

Variables are key/value pairs accessible by Pipeline Step commands. Use environment Variables to store configuration data used by commands in your Pipeline steps (such as compiler flags, environment specific configuration, credentials and secrets).

:::note

If a resource requires multiple Variables to be written to a custom file (e.g. an Application `.env` file), we recommend storing them using 'Configuration Files' instead of multiple variables.

:::

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications, find the application to which you want to add a variable and click the `NAME` of the application
1. Click the `VARIABLES` tab
1. On the right corner of the variables tab click `ADD VARIABLE`
1. Follow the instructions in the add variable step form then click `CONFIRM`
    > A new deployment is required for your changes to take effect.
      - Follow the guide [/docs/applications/deploy-application]
