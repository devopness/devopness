---
title: Remove a Self Hosted Server
intro: Learn how to remove a self hosted server
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
required_permissions:
    - server:delete
---

:::note

Removing a self hosted server will not delete its data from the host

:::

1. On Devopness, navigate to a project then select an environment
1. Find the `Servers` card
1. Click the `View` in the `Servers` card, to see a list of existing `Servers`
1. In the list of servers, find the server you want to remove and click the `NAME` of the server
1. On the upper-right corner of the server details view, click `REMOVE`
1. Follow the prompts then click `REMOVE SERVER`
1. Wait for the `server:remove` action to be completed
    > If this action fails, maybe your server status is different from "stopped", if this is the case follow the guide [/docs/servers/stop-server]
1. Follow the guide [/docs/servers/get-server-status]
    > The server status will be "deleted"
