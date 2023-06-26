---
draft: true
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

{% note %}

**NOTE**: Any applications or daemons on this server will stop working as a consequence of the server being stopped.

{% endnote %}

{% note %}

**NOTE**: Your server's public IP address will be updated the next time the server is started, unless you have configured an elastic IP on your cloud provider management panel; meaning, the next time this server is started, you will need to update any domains pointing to this server.

{% endnote %}

1. On Devopness, navigate to a project then select an environment
1. Find the `Servers` card
1. Click the `View` in the `Servers` card to see a list of existing `Servers`
1. In the list of servers, find the server you want to stop and click `DETAILS`
3. On the upper-right corner of the server details view click `ACTIONS`
4. Use the drop-down menu to choose `Stop`
5. Wait for the `Server:stop` action to be completed
6. Follow the guide [Get a Server’s Status](/docs/servers/get-server-status)
    > The server status will be "stopped"
