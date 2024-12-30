---
title: Remove a File
intro: Learn how to remove a configuration file when it's no longer needed
links:
    overview:
    quickstart:
    previous: applications/add-application
    next: files/add-file
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card, to see a list of existing `Applications`
1. In the list of applications, find the application with the configuration file you want to remove and click the `NAME` of the application
1. Click the `CONFIGURATION FILES` tab
1. In the list of configuration files, find the configuration file you want to remove and click `REMOVE`
1. Follow the prompts then click `REMOVE CONFIGURATION FILE`
1. In the list of configuration files, the recently removed `Configuration File` will be gone
    > A new deployment is required for your changes to take effect.
      - Follow the guide [/docs/applications/deploy-application]
