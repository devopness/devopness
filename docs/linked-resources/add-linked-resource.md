---
title: Add a Linked Resource
intro: Link a server to an application to select which servers an application can be deployed.
links:
    overview:
    quickstart:
    previous:
        - /docs/files/add-file
    next:
        - /docs/applications/deploy-application
    guides:
    related:
    featured:
---

{% note %}

**NOTE**: Here `server` and `application` were used as examples of resource types. However, the steps to link two resources are the same for any environment's resources that can be linked. Clicking the `LINK TO` dropdown will list all available options of resource types to be linked to the selected resource.

{% endnote %}

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. Click `DETAILS` on the application you want to link a server
1. On the upper-right corner of the application details view, click `...`
1. Use the drop-down menu to choose `Linked resources`
1. On the upper-right corner of the `Linked resources` list, click `LINK TO`
1. Use the drop-down menu to choose `Servers`
1. Follow the prompts then click `Link`
1. In the `Linked Resource` list, the recently linked server can be seen in the `DEPENDS ON` table
