---
title: Add an SSH key
intro: Sometimes you and your team members need to connect to your servers to run commands from the terminal. Add SSH keys to environment servers to ensure secure server access by only the authorized SSH keys.
links:
    overview:
    quickstart:
    previous:
        - /docs/ssh-keys/create-ssh-key-pair
    next:
        - /docs/servers/ssh-into-server
    guides:
    related:
        - /docs/ssh-keys/create-ssh-key-pair
        - /docs/ssh-keys/remove-ssh-key
    featured:
required_permissions:
    - resource_type: SSH Keys
      permissions: Add
---

1. On Devopness, navigate to a project then select an environment
2. Find the `SSH Keys` card
3. Click `View` in the `SSH Keys` card to see a list of existing `SSH Keys`
4. On the upper-right corner of the list click `ADD SSH KEY`
5. Provide a name to the `SSH Key` being added. For example, "Company Laptop"
6. Paste in your public key
    > See [Create an SSH key](/docs/ssh-keys/create-ssh-key-pair) for instructions on how to create your public key
7. Click `NEXT`
8. Follow the prompts to complete the configuration of the new `SSH Key`
9. Click `CONFIRM`
