---
title: Deploy SSH Key
intro: Deploy your SSH Keys to each of the servers you want the keys on.
links:
    overview:
    quickstart:
    previous:
        - /docs/ssh-keys/link-ssh-key
    next:
        - /docs/servers/ssh-into-server
    guides:
    related:
    featured:
required_permissions:
    - ssh-key:deploy
---

1. On Devopness, navigate to a project then select an environment
1. Find the `SSH Keys` card
1. Click `View` in the `SSH Keys` card to see a list of existing `SSH Keys`
1. Click `DETAILS` on the SSH key you want to deploy
1. On the upper-right corner of the SSH key details view, click `DEPLOY`
1. Choose the pipeline to be deployed, then click `Next`
1. Review deploy information then click `DEPLOY`
1. Wait for the `Ssh-key:Deploy` action to be completed
