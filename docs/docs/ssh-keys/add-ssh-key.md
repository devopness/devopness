---
title: Add an SSH key
intro: Sometimes you and your team members need to connect to your servers to run commands from the terminal. Add SSH keys to environment servers to ensure secure server access by only the authorized SSH keys.
links:
    overview:
    quickstart:
    previous: ssh-keys/create-ssh-key-pair
    next: ssh-keys/link-ssh-key
    guides:
    related:
        - ssh-keys/create-ssh-key-pair
        - ssh-keys/remove-ssh-key
    featured:
required_permissions:
    - ssh-key:create
---

1. On Devopness, navigate to a project then select an environment
1. Find the `SSH Keys` card
1. Click `View` in the `SSH Keys` card to see a list of existing `SSH Keys`
1. On the upper-right corner of the list click `ADD SSH KEY`
1. Provide a name to the `SSH Key` being added. For example, "Company Laptop"
1. Paste in the public key
    - If you want to create a new key, see [/docs/ssh-keys/create-ssh-key-pair] for instruction on how to create a public key
1. Click `NEXT`
1. Follow the prompts to complete the configuration of the new `SSH Key`
1. Click `CONFIRM`
