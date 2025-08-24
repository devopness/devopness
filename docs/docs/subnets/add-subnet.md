---
title: Add a Subnet
intro: Add a subnet to your network when you need to define custom network topology within a network.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
required_permissions:
    - subnet:create
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Networks` card
1. Click `View` in the `Networks` card, to see a list of existing `Networks`
1. In the list of networks find the network where you want to add a subnet and click the `NAME` of the network
1. On the upper-right corner of network details view, click the `Subnets` tab
1. On the upper-right corner of subnets tab click `MANAGE`
1. Follow the prompts
1. Provide a name to the Subnet being added. Example: "Public Subnet A", "Private Subnet B"
1. Select a `Type` and click `NEXT`
1. Provide a CIDR block to the Subnet being added. Example: "10.108.0.0/20"
1. Click `CONFIRM`
    - After the Subnet is created an action will be automatically started to provision the Subnet on the chosen cloud provider
