---
sidebar_position: 15
title: Restart a Server
intro: Sometimes running many concurrent pipelines may slow down your servers. Restart your server to force all running tasks to end and start the server again in the same action.
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
1. In the list of servers, find the server you want to restart and click the `NAME` of the server
1. On the upper-right corner of the server details view click `ACTIONS`
1. Use the drop-down menu to choose `Restart`
1. Wait for the `server:restart` action to be completed
1. Follow the guide [/docs/servers/get-server-status]
    > The server status will be "running"
