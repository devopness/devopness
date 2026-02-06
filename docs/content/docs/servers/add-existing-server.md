---
title: Add an Existing Server
intro: If you have servers provisioned outside of your desired environment on Devopness, you can still connect them to your Devopness account and take the most of the Devopness infrastructure management features.
links:
    overview:
    quickstart:
    previous: servers/add-server
    next: servers/check-server-provision-logs
    guides:
    related:
    featured:
required_permissions:
    - server:create
---

1. On Devopness, navigate to a project then select an environment
1. If there's no other server in the selected environment, just click `Add Server`
1. If a list of resource cards is displayed, find the `Servers` card
1. Click `View` in the `Servers` card to see a list of existing `Servers`
1. On the upper-right corner of the list click `ADD SERVER`
1. On the `Cloud Provider` drop-down menu choose `VPS/Self Hosted`
1. Provide the `Public IP address` of your existing server
1. Enter the `SSH Port` to be used to connect to the server

    :::note

    We do not recommend connecting servers that are already being used in production. Server's existing configuration will be lost and replaced by Devopness during the server setup process

    :::

1. Click `NEXT`
1. Follow the prompts to complete the configuration of the new `Server`
1. Click `CONFIRM`
    - If you see a message saying `Error establishing a SSH connection to server`, please verify if the IP address and SSH port used are correct and if external SSH connections are allowed on this server
1. After the `Server` is added you will be redirected to the `Connect` page
1. Find the `Command to connect` field and click `Copy to clipboard`
1. Log into your server as the `root` user
1. Paste the command that has been copied to the clipboard and run it
1. A message will be displayed in the terminal window when the server connect command is successfully completed
1. On Devopness, once the server is displayed as `Connected`, it's been added to the selected environment
