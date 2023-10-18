---
title: Archive an Environment
intro: You can archive an environment to make it read-only for all users as a way to indicate that it's no longer actively maintained. When an environment is archived all its data is preserved, including the environment settings, team memberships and environment resources. Archived environments can be unarchived at any time.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

{% note %}

**NOTE**: Archiving an environment does not remove its cloud resources from the corresponding cloud providers where they were provisioned. For cost savings, if an environment has cloud resources that are no longer needed, it's recommended that you remove the resources using Devopness **before** archiving an environment.

{% endnote %}

{% note %}

**NOTE**: Archived environments can only be accessible, in read-only mode, by the user who owns the project to which the environment belongs to.

The project owner can unarchive an archived environment, making it active and accessible to other team members. For more information, see {% mentionPost "/docs/environments/unarchive-environment" %}

{% endnote %}

1. On Devopness upper-left corner, click the Devopness logo to see a list of existing projects
1. Select a `Project`
1. Find the `Environments` card
1. Click `View` in the `Environments` card to see a list of existing `Environments`
1. Find the `Environment` you want to archive and click `View`
1. On the upper-right corner of the `Environment` resources list, click `...`
1. Use the drop-down menu to choose `Archive`
1. Follow the instructions in the form then click `Archive`
