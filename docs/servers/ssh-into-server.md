---
title: Connect to your servers using SSH
intro: Sometimes you and your team members need to connect to your servers to run commands from the terminal. Connect via SSH to ensure your servers only executes commands by authorized SSH keys.
links:
    overview:
    quickstart:
    previous: servers/check-server-provision-logs
    next: applications/add-application
    guides:
    related:
        - ssh-keys/add-ssh-key
        - ssh-keys/remove-ssh-key
    featured:
---

1. On Devopness, copy the IP Address of the server you want to connect
    > Follow the [/docs/servers/find-server-ip-address] guide
1. On your local machine, in a terminal window, use the `ssh` command to connect to the server
    ```bash
    ssh devopness@<server IP address copied in previous steps>
    ```
    > This should give you shell access to your remote server hosted at the IP address, logged in as user `devopness`
    > If you receive a `Connection refused` error, please follow the [/docs/ssh-keys/add-ssh-key] guide
1. Test your SSH connection running simple commands on your server, e.g: `whoami` or `ls`
1. When you are finished with your remote server terminal usage, run the `exit` command to close the SSH connection.
