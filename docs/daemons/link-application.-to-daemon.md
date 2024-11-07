---
title: Link a Daemon to an Application
intro: Link a Daemon to an Application to manage persistent background tasks within the application environment.
links:
    overview:
    quickstart:
    previous: /docs/daemons/link-server-to-daemon
    next: /docs/daemons/edit-daemon
    guides:
    related:
    featured:
---

By default, you can select an Application when creating the Daemon. However, if an Application was not chosen during the creation process, you can link one afterward by editing the Daemon.

1. On Devopness, navigate to a project, then select an environment
1. Find the `Daemons` card
1. Click `View` in the `Daemons` card to see a list of existing `Daemons`
1. In the list of Daemons, find the daemon you want to link to an application and click the `NAME` of the daemon
1. On the Daemon details page, click `EDIT` in the upper-right corner
1. On the "Working Directory" of the Daemon configuration, select the desired Application
1. Click `NEXT`, then `CONFIRM`
1. In the `Applications` list, the recently linked application can be seen
    - A new deployment is required for your changes to take effect
        - Follow the guide {% mentionPost "/docs/pipelines/run-pipeline" %}
