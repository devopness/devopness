---
title: Add a Server to Microsoft Azure
intro: Devopness allows you to provision a server on Azure Resource Manager (RM) and manage it through Devopness.
links:
    overview:
    quickstart:
    previous: servers/add-server
    next: servers/check-server-provision-logs
    guides:
    related:
    featured:
---

> If you don't have an Azure credential, please follow the guide [/docs/credentials/add-azure-credential]

> Microsoft Azure requires that you create your own custom network and subnet to provision a server, if you don't have one, please follow the guide [/docs/networks/add-network]

1. On Devopness, navigate to a project then select an environment
2. Find the `Servers` card
3. Click `View` in the `Servers` card to see a list of existing `Servers`
4. On the upper-right corner of the list click `ADD SERVER`
5. Choose `Microsoft Azure` as cloud provider
6. Select a `Credential`
    > If no credential is listed or you want to use a different one, click `Create a new Credential` and follow the guide [/docs/credentials/add-credential]
7. Follow the prompts to complete the configuration of the new `Server`
8. Review server information and settings. If everything is correct, click `CONFIRM`
    > Use the `PREVIOUS` button if you need to modify any server details
9. Wait for the `server:provision` action to be completed
10. After the server is successfully provisioned it will be visible on `Azure` portal
11. If you want to access the server on `Azure` portal:
    - Access [Azure Portal](https://portal.azure.com/)
    - In the search bar, type and select `Virtual machines`
    - An `Virtual Machine` instance will be listed, with the name of the new `Server` you provisioned on Devopness
