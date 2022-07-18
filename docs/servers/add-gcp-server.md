---
title: Add a Server to Google Cloud Platform (GCP)
intro: Devopness allows you to provision a server on Google Cloud Platform using
Google Compute Engine and manage it through Devopness.
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
1. If there's no other server in the selected environment, just click Add Server
1. If a list of resource cards is displayed, find the Servers card and click View on it
1. On the upper-right corner of the list click `ADD SERVER`
1. Choose `Google Cloud Platform` as cloud provider
1. Select a GCP credential using the drop-down menu
1. Click `NEXT`
1. Select instance information:
    - Select an avaliable region
    - Select an avaliable instance type
    - Fill the `Disk size` field with a value above 10GB
    - Click `NEXT`
1. Provide your server name, OS and hostname and click `NEXT`
1. Review server information and settings. If everything is correct, click `CONFIRM`
    > Use the PREVIOUS button to come back and change server informations if needed
1. Wait for your server provision to finish 
1. If the provision was successful, go to your GCP console and make sure a Google Compute Engine has been created
    - Access [GCP console](https://console.cloud.google.com/)
    - On the Search box, enter “Compute Engine” and select it from search results
    - Make sure your instance is listed and correctly named