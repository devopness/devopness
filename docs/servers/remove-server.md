---
draft: true
title: Remove a Server
intro: Sometimes you may want to delete a server that has not been used recently. Remove a server to delete all the server data from the cloud provider.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Servers` card
1. Click the `View` in the `Servers` card to see a list of existing `Servers`
1. In the list of servers, find the stopped server you want to remove and click `DETAILS`
    > If you don’t have any stopped servers, follow the guide [Stop a Server](/docs/servers/stop-server)
1. On the upper-right corner of the stopped server details view click `...`
1. Use the drop-down menu to choose `REMOVE`
1. Follow the instructions in the remove form then click `REMOVE`
5. Wait for the `Server:delete` action to be completed
6. Follow the guide [Get a Server’s Status](/docs/servers/get-server-status)
    > The server status will be "deleted"
