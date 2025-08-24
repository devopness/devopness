---
sidebar_position: 1
title: Create an SSH key pair
intro: Sometimes you may need to connect to your servers using an SSH client to run terminal commands on your remote server. An SSH public key is used for secure authentication when you use an SSH client to connect to a server managed by Devopness. When you connect, you must provide the private key that matches the public key added to the remote server. Create an SSH private/public key pair to securely authenticate your server access on the new device. Several tools exist to generate SSH public/private key pairs. The following steps show how to generate an SSH key pair on UNIX and UNIX-like platforms.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - ssh-keys/add-ssh-key
        - ssh-keys/remove-ssh-key
    featured:
---

1. On your local machine, in a terminal window, run the command below, replacing `<your email address>` with a valid email address
    ```bash
    ssh-keygen -t rsa -b 4096 -C "<your email address>"
    ```
    > This creates a new SSH key, using the provided email as a label.
1. Follow the prompts to complete the creation of the new SSH Key pair
    > There should be 2 new files inside `$USER/.ssh` directory, `id_rsa` (private key) and `id_rsa.pub` (public key)
1. To add the public key (`id_rsa.pub`) to Devopness, see [/docs/ssh-keys/add-ssh-key]
