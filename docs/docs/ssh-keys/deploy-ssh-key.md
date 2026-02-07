---
title: Deploy SSH Key
intro: Deploy your SSH Keys to each of the servers you want to give access to using those keys.
links:
    overview:
    quickstart:
    previous: ssh-keys/link-ssh-key
    next: servers/ssh-into-server
    guides:
    related:
    featured:
required_permissions:
    - ssh-key:deploy
---

1. On Devopness, navigate to a project then select an environment
1. Find the `SSH Keys` card
1. Click `View` in the `SSH Keys` card to see a list of existing `SSH Keys`
1. In the list of SSH keys, find the SSH key you want to deploy and click the `NAME` of the SSH key
1. On the upper-right corner of the SSH key details view, click `DEPLOY`
1. Choose a deploy pipeline to be run, then click `Next`
1. Review deploy information, then click `DEPLOY`
1. Wait for the `ssh-key:deploy` action to be completed
