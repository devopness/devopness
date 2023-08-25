---
draft: true
title: Add a Network
intro: By default, every cloud provider provisions at least one network/VPC (Virtual Private Cloud) in each region to which a user's account has access. However there are cases where you might need to define custom network topology, for example to isolate resources that should not be directly connected. Add a network to define a custom network topology.
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
1. Select a connected `Source Provider` account
    > If no source provider account is listed or you want to use a different one, follow the guide [Add a Cloud Provider Credential](/docs/users/credentials/add-credential)
1. Follow the prompts to complete the configuration of the new `Network`
1. Click `CONFIRM`
1. In the `Networks` list, the recently created `Network` can be seen.
    - If you want to add a server to the `Network`, it is required to first follow the guide [Add a Subnet](/docs/subnets/add-subnet)
