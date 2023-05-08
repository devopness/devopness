---
title: Test SSH connection
intro: Sometimes you may need to verify your ssh access to your servers. Testing your access is important to ensure the creation and adition of your keys were setup correctly.
links:
    overview:
    quickstart:
    previous:
    next:
        - /docs/ssh-keys/remove-ssh-key
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
    > The ip address should be number separated by dots, e.g: 192.0.2.1
1. On Terminal, run the remote login program with the command
    ```bash
    ssh devopness@192.0.2.1
    ```
    > This should give you shell access to your remote server hosted at the IP address, logged in as user `devopness`
1. Run command `logout`, to close connection.