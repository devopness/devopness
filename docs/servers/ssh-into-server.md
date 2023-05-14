---
title: Connect to your servers using SSH
intro: Sometimes you and your team members need to connect to your servers to run commands from the terminal. Connect via SSH to ensure your servers only executes commands by authorized SSH keys.
links:
    overview:
    quickstart:
    previous:
        - /docs/servers
    next:
        - /docs/servers/check-server-provision-logs
    guides:
    related:
        - /docs/ssh-keys/add-ssh-key
        - /docs/ssh-keys/remove-ssh-key
    featured:
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Servers` card
1. Click the `View` in the `Servers` card to see a list of existing `Servers`
1. In the list of servers, find the server you want to connect and copy the server' IP Address
    > The ip address should be a number separated by dots, e.g: 41.234.56.78
1. In a terminal window, use the `ssh` command to connect to the server
    ```bash
    ssh devopness@<server IP address copied in previous steps>
    ```
    > This should give you shell access to your remote server hosted at the IP address, logged in as user `devopness`
1. Test your SSH connection running simple commands on your server, e.g: `whoami` or `ls`
1. When you are finished with your remote server terminal usage, run the `exit` command to close the SSH connection.
