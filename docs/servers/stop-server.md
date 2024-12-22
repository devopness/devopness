---
title: Stop a Server
intro: Sometimes you may want to interrupt a server to stop a long running task. Stop a server to force any running tasks to end.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

:::note

Any applications or daemons on this server will stop working as a consequence of the server being stopped.

:::

:::warning

Your server's public IP address will be updated the next time the server is started, unless you have a static IP address set configured for the selected instance on your cloud provider. That means that if your server does not have a static IP address associated to it, the next time this server is started all domains that point to this server's old IP address will need to be updated to point to the server's new IP address.

:::

1. On Devopness, navigate to a project then select an environment
1. Find the `Servers` card
1. Click the `View` in the `Servers` card to see a list of existing `Servers`
1. In the list of servers, find the server you want to stop and click the `NAME` of the server
1. On the upper-right corner of the server details view click `ACTIONS`
1. Use the drop-down menu to choose `Stop`
1. Wait for the `server:stop` action to be completed
1. Follow the guide [/docs/servers/get-server-status]
    > The server status will be "stopped"
