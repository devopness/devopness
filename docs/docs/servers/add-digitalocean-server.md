---
sidebar_position: 7
title: Add a Server to DigitalOcean
intro: Devopness allows you to provision a server on DigitalOcean using Droplets and manage it through Devopness.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

> If you don't have an DigitalOcean credential, please follow the guide [/docs/credentials/add-digitalocean-credential]

1. On Devopness, navigate to a project then select an environment
1. If there's no other server in the selected environment, just click `ADD SERVER`
1. If a list of resource cards is displayed, find the `Servers` card and click View on it
1. On the upper-right corner of the list click `ADD SERVER`
1. Choose `DigitalOcean` as cloud provider
1. Select a `Credential`
    > If no credential is listed or you want to use a different one, click `Create a new credential` and follow the guide [/docs/credentials/add-credential]
1. Follow the prompts to complete the configuration of the new `Server`
1. Review server information and settings. If everything is correct, click `CONFIRM`
    > Use the `PREVIOUS` button if you need to modify any server details
1. Wait for the `server:provision` action to be completed
1. After the server is successfully provisioned it will be visible on `DigitalOcean` console
1. If you want to access the server on `DigitalOcean` console:
    - Log in to [DigitalOcean Control Panel](https://cloud.digitalocean.com/)
    - Find the droplets section
    - A `droplet` instance will be listed, with the name of the new `Server` you provisioned on Devopness
