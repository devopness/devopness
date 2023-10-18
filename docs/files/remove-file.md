---
title: Remove a Configuration File
intro: Learn how to remove a configuration file when it's no longer needed
links:
    overview:
    quickstart:
    previous:
        - /docs/applications/add-application
    next:
        - /docs/configuration-files/add-configuration-file
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card, to see a list of existing `Applications`
1. In the list of applications, find the application with the configuration file you want to remove and click `DETAILS`
1. On the upper-right corner of the applications details view, click `SETTINGS`
1. Use the drop-down menu to choose `CONFIGURATION FILES`, to see a list of existing `Configuration Files`
1. In the list of configuration files, find the file you want to remove and click `DETAILS`
1. On the upper-right corner of the configuration file details view, click `...`
1. Use the drop-down menu to choose `REMOVE`
1. Follow the prompts then click `REMOVE`
1. In the list of configuration files, the recently removed `Configuration File` will be gone
    > A new deployment is required for your changes to take effect.
      - Follow the guide {% mentionPost "/docs/applications/deploy-application" %}
