---
title: Add a Server to Google Cloud Platform (GCP)
intro: Devopness allows you to provision a server on GCP using Google Compute Engine (GCE) and manage it through Devopness.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

# Add a Server to Google Cloud Platform (GCP)
1. On Devopness, navigate to a project then select an environment
1. If there's no other server in the selected environment, just click `ADD SERVER`
1. If a list of resource cards is displayed, find the `Servers` card and click View on it
1. On the upper-right corner of the list click `ADD SERVER`
1. Choose `Google Cloud Platform` as cloud provider
1. Select a GCP credential using the drop-down menu
    > If no credential is listed or you want to use a different one, please follow the [Add a Cloud Provider Credential](/docs/cloud-provider-credentials/add-cloud-provider-credential/) guide
1. Click `NEXT`
1. Select an avaliable region using the drop-down menu
1. Select an avaliable instance type using the drop-down menu
1. Set the `Disk size`
1. Click `NEXT`
1. Provide your server name, OS and hostname and click `NEXT`
1. Review server information and settings. If everything is correct, click `CONFIRM`
    > Use the `PREVIOUS` button if you need to modify any server details
1. Wait for your server provision to finish
1. After the server is successfully provisioned it will be visible on GCP console
1. If you want to access the server on GCP console:
    - Access [GCP Console](https://console.cloud.google.com/)
    - On the Search box, enter “Compute Engine” and select it from search results
    - A `GCE` instance with the name provided on Devopness web interface will be listed
