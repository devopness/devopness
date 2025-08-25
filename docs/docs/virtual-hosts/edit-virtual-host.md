---
title: Edit a Virtual host
intro: Edit a Virtual Host to change how an application is accessible on the internet , by server IP address or a domain name
links:
    overview:
    quickstart:
    guides:
    related:
        - virtual-hosts/list-virtual-hosts
        - virtual-hosts/view-virtual-host
    featured:
required_permissions:
    - virtual-host:update
    previous:
    next:
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Virtual hosts` card
1. Click `View` in the `Virtual hosts` card to see a list of existing `Virtual hosts`
1. In the list of virtual hosts, find the virtual host you want to edit and click the `NAME` of the virtual host
1. On the upper right corner of the application details view, click `EDIT`
1. Follow the prompts then click `CONFIRM`
    - A new deployment is required for your changes to take effect
        - Follow the guide [/docs/pipelines/run-pipeline]
