---
title: Add a Server to DigitalOcean
intro: Devopness allows you to provision a server on DigitalOcean using Droplets and manage it through Devopness.
links:
    overview:
    quickstart:
    previous: /docs/servers/add-server
    next: /docs/servers/check-server-provision-logs
    guides:
    related:
    featured:
---

> If you don't have an DigitalOcean credential, please follow the guide {% mentionPost "/docs/credentials/add-digitalocean-credential" %}

1. On Devopness, navigate to a project then select an environment
1. If there's no other server in the selected environment, just click `ADD SERVER`
1. If a list of resource cards is displayed, find the `Servers` card and click View on it
1. On the upper-right corner of the list click `ADD SERVER`
1. Choose `DigitalOcean` as cloud provider
1. With the `Cloud Provider` selected, the drop-down `Credentials` list all credentials of this `Cloud Provider`, select a credential 
    > If no credential is listed or you want to use a different one, click `Create a new credential` and follow the guide {% mentionPost "/docs/credentials/add-credential" %}
1. Once a `Cloud Provider Credential` is selected, click in `Next` button
1. Select an available region using the drop-down menu
1. Select an available instance type using the drop-down menu
1. Set the `Disk size`
1. Click `NEXT`
1. Provide your server name, OS and hostname and click `NEXT`
1. Follow the prompts to complete the configuration of the new `Server`
1. Review server information and settings. If everything is correct, click `CONFIRM`
    > Use the `PREVIOUS` button if you need to modify any server details
1. Wait for the `Server:provision` action to finish
1. After the server is successfully provisioned it will be visible on `DigitalOcean` console
1. If you want to access the server on `DigitalOcean` console:
    - Log in to [DigitalOcean Control Panel](https://cloud.digitalocean.com/)
    - Find the droplets section
    - A `droplet` instance will be listed, with the name of the new `Server` you provisioned on Devopness
