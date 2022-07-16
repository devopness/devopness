---
title: Get Google Service Account Credentials
intro: In order to allow Devopness to manage Google Cloud Platform (GCP) resources for you, you need to provide us Service Account Credentials.
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
> If you created a new project, a notification modal will appear showing your new project creation status.
> Reload the console page if your new project is not listed a few seconds after its creation is succeded.
2. Make sure `Compute Engine API` is enabled on the selected Project:
  - On GCP console, click on the dropdown menu and select [APIs and Services](https://console.cloud.google.com/apis/dashboard)
  - Make sure the correct project is selected in GCP console's header left side
  - Click on **Enable APIs and Services** on top of the page
  - On the Search box, enter “Compute Engine API” and select it from search results
  - If `Compute Engine API` is already activated, you will see the `Manage` button at the screen
  - Otherwise, click `Enable` button
3. Go back to [projects console](https://console.cloud.google.com/project)
4. Having your project listed, click the three dot button on it and pick the `Settings` option
5. On the left side menu under `IAM & Admin`, select the `Service Accounts` option 
6. Make sure a service account named as `{{project-id}}-comput@developer.gserviceaccount.com` is listed
7. If you do not have a service account, [create a new one](https://cloud.google.com/iam/docs/creating-managing-service-account-keys):
  - Click `+ CREATE SERVICE ACCOUNT` option bellow the search bar
  - Name your new service account
  - Click `DONE`
8. Having your service account listed, go to the `Actions` column, click the three dot menu on your service account and choose `Manage details` option
9. Copy your service account email to your clipboard
10. Bellow your service account name, go to the `PERMISSIONS` tab
11. Make sure your service account has the `Compute Engine Service Agent` role 
12. If the service account doesn't have the `Compute Engine Service Agent` role, set it:
  - Click `GRANT ACCESS` button 
  - Paste the service account email on the `New principals` field
  - Select the `Compute Engine Service Agent` option
  - Click `SAVE`
13. On the left side menu under `IAM & Admin`, select the `IAM` option
14. Having your service account listed, edit its roles:
  - Click the edit icon on yout service account
  - Click `ADD ANOTHER ROLE` 
  - Select the `Compute Instance Admin (v1)` role to this email
  - Click `SAVE`
15. On the left side menu under `IAM & Admin`, select the `Service Accounts` option
16. Go to the `Actions` column on your service account, click the three dot menu and choose `Manage keys` option
17. Add a new service account key
  - Click `ADD KEY` button
  - Select `Create new key` option
  - Pick `JSON` key type
  - Click `CREATE`
18. A JSON file containing your service account credentials will be downloaded, copy it's content to your clipboard
19. Having your service account credentials, follow the [Add a Cloud Provider Credential](./add-cloud-providers-credentials.md) guide.
