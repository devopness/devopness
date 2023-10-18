---
draft: true
title: Add a Network
intro: Add a network to your environment when you need to define custom network topology. Resources (such as Servers and Applications) deployed to different networks, will be completely isolated from each other.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
required_permissions:
    - network:create
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Networks` card
1. Click `View` in the `Networks` card to see a list of existing `Networks`
1. On the upper-right corner of the list click `ADD NETWORK`
1. Select a `Cloud Provider Credential`
    > If no credential is listed or you want to use a different one, follow the guide {% mentionPost "/docs/users/credentials/add-credential" %}
1. Follow the prompts then click `CONFIRM`
1. In the `Networks` list, the recently created `Network` can be seen
    - If you want to add a server to the `Network`, it is required to first follow the guide {% mentionPost "/docs/subnets/add-subnet" %}
