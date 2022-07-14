---
title: Get Google Service Account Credentials
intro: In order to allow Devopness to manage Google Cloud resources for you, you need to provide us Service Account Credentials.
links:
    overview:
    quickstart:
    previous:
    next:
        - /docs/cloud-provider-credentials/add-cloud-providers-credentials
    guides:
    related:
    featured:
---

# Get Service Account Credentials

1. Access a GCP project or create a new one: https://console.cloud.google.com/project
> Reload the console page in case your new project is not listed after a few seconds.
2. Make sure `Compute Engine API` is enabled on the selected Project
  - On Google Cloud Platform console, click on the dropdown menu and select [APIs and Services](https://console.cloud.google.com/apis/dashboard)
  - Click on **Enable APIs and Services** on top of the page
  - On the Search box, enter “Compute Engine API” and select it from search results
  - Click `Enable`
3. Having your project listed, click the three dot button on it and choose the `Settings` option
4. On the left side menu under `IAM & Admin`, select the `Service Accounts` option 
5. If you do not have a service account, [create a service new one](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
6. Having your service account listed, click the three dot menu on it and choose de `Manage details` option
7. Copy your service account email to your clipboard
8. Bellow your service account name, go to the `PERMISSIONS` menu
9. Click `GRANT ACCESS` button
10. Paste the service account email on the `New principals` field
11. Select the `Service Account Admin` role to this email
12. Click `ADD ANOTHER ROLE` and select the `Compute Engine Service Agent` option
13. Again click `ADD ANOTHER ROLE` and select the `Owner` option
14. Bellow your service account name, go to the `KEYS` menu
15. Click `ADD KEY` button
16. Select `Create new key` option followed by the `JSON` option, then click `CREATE` button
17. A JSON file containing your service account credentials will be downloaded, copy it's content to your clipboard
18. Having your service account credentials, follow the [Add a Cloud Provider Credential](./add-cloud-providers-credentials.md) guide.
