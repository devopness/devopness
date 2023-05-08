---
title: Create an SSH key pair
intro: Sometimes you may need to connect to your servers on a new device. Create SSH keys to authenticate your server access on the new device.
links:
    overview:
    quickstart:
    previous:
    next:
        - /docs/ssh-keys/add-ssh-key
    guides:
    related:
        - /docs/ssh-keys/add-ssh-key
        - /docs/ssh-keys/remove-ssh-key
    featured:
---

1. On Terminal, run command below, substituting in your Devopness email address
    ```bash
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    ```
    > This creates a new SSH key, using the provided email as a label.
    > Devopness is working to support the most populars cryptosystem keys types,
    > for now we are are supporting RSA and DSA.
1. Follow the prompts to complete the creation of the new SSH Key pair
    > There should be 2 new files inside `$USER/.ssh` directory, `id_rsa` (private key) and `id_rsa.pub` (public key)
1. Start the `ssh-agent`, using command:
    ```bash
    eval "$(ssh-agent -s)"
    ```
1. Add your private key to `ssh-agent`
    ```bash
    ssh-add ~/.ssh/id_rsa
    ```
1. To add the public key (`id_rsa.pub`) to Devopness, see [Add a SSH key](/docs/ssh-keys/add-ssh-key)
