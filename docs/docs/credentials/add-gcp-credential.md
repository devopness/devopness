---
title: Add Google Cloud Platform (GCP) Credential
intro: In order to allow Devopness to manage GCP resources on your behalf, Service Account key has to be provided.
links:
overview:
quickstart:
previous:
next: credentials/add-credential
guides:
related:
featured:
---

> If you don't have access to a GCP account, you can create an account for free following the cloud provider specific guide [Google Cloud Free Tier](https://cloud.google.com/free)

## Select your GCP project

1. Access a GCP project or create a new one: [https://console.cloud.google.com/project](https://console.cloud.google.com/project)

   > If you created a new project, a notification modal will appear showing your new project creation status.
   > Note: It might take a few seconds for the new project to be visible in the project list.
   > If your new project is not listed a few seconds after its creation, reload the console page.

## Enable GCP Compute Engine API

2. Make sure `Compute Engine API` is enabled on the selected Project:
   - On GCP console, click on the dropdown menu and select [APIs and Services](https://console.cloud.google.com/apis/dashboard)
   - Make sure the correct project is selected in GCP console's header left side
   - Click on **Enable APIs and Services** on top of the page
   - On the Search box, enter "Compute Engine API" and select it from search results
   - If `Compute Engine API` is already activated, you will see the `Manage` button at the screen
   - Otherwise, click `Enable` button

## Enable GCP IAM API

3. Make sure `IAM API` is enabled on the selected Project:
   - On GCP console, click on the dropdown menu and select [APIs and Services](https://console.cloud.google.com/apis/dashboard)
   - Make sure the correct project is selected in GCP console's header left side
   - Click on **Enable APIs and Services** on top of the page
   - On the Search box, enter "IAM API" and select it from search results
   - If `IAM API` is already activated, you will see the `Manage` button at the screen
   - Otherwise, click `Enable` button

## Enable GCP Cloud Resource Manager API

4. Make sure `Cloud Resource Manager API` is enabled on the selected Project:
   - On GCP console, click on the dropdown menu and select [APIs and Services](https://console.cloud.google.com/apis/dashboard)
   - Make sure the correct project is selected in GCP console's header left side
   - Click on **Enable APIs and Services** on top of the page
   - On the Search box, enter "Cloud Resource Manager API" and select it from search results
   - If `Cloud Resource Manager API` is already activated, you will see the `Manage` button at the screen
   - Otherwise, click `Enable` button

## Enable GCP Cloud Asset API

5. Make sure `Cloud Asset API` is enabled on the selected Project:
   - On GCP console, click on the dropdown menu and select [APIs and Services](https://console.cloud.google.com/apis/dashboard)
   - Make sure the correct project is selected in GCP console's header left side
   - Click on **Enable APIs and Services** on top of the page
   - On the Search box, enter "Cloud Asset API" and select it from search results
   - If `Cloud Asset API` is already activated, you will see the `Manage` button at the screen
   - Otherwise, click `Enable` button

## Set up a GCP service account

6. Go back to [projects console](https://console.cloud.google.com/project)
7. Having your project listed, click the three dot button on it and pick the `Settings` option
8. On the left side menu under `IAM & Admin`, select the `Service Accounts` option
9. Make sure a service account named as `<project-id>-compute@developer.gserviceaccount.com` is listed
10. If you do not have a service account, [create a new one](https://cloud.google.com/iam/docs/creating-managing-service-account-keys):
    - Click `+ CREATE SERVICE ACCOUNT` option below the search bar
    - Name your new service account
    - Click `DONE`
11. Having your service account listed, go to the `Actions` column, click the three dot menu on your service account and choose `Manage details` option
12. Copy your service account email to your clipboard

## Grant required IAM roles to the service account

To allow Devopness to provision compute and network resources, the service account must have the following roles assigned at the **project level**.

### Minimum required roles

- **Project / IAM (read-only)**
  - `Reader`

- **Compute**
  - `Compute Instance Admin (v1)`

- **Network**
  - `Compute Network Admin`

- **Service Account usage**
  - `Service Account User`

These roles are sufficient for provisioning while avoiding broad administrative access.

:::note

Avoid assigning primitive roles such as `Owner`, `Editor`, or `Viewer`.
The roles listed above provide the required permissions with reduced security exposure.

:::

### Grant the Compute Engine Service Agent role

13. Below your service account name, go to the `PERMISSIONS` tab
14. In the permissions table, go to `VIEW BY ROLES` tab
15. Make sure your service account has the `Compute Engine Service Agent` role

:::note

You may need to check the box labeled "Include Google-provided role grants" to see the `Compute Engine Service Agent` role in the list.

:::

16. If the service account doesn't have the `Compute Engine Service Agent` role, set it:
    - Click `GRANT ACCESS` button
    - The `Grant access to "..."` form will be displayed
    - Under `Add Principals`, click the `New principals` field and paste the service account email you copied earlier
    - Under `Assign roles`, click the `Role` field and select the `Compute Engine Service Agent` option
    - Click `SAVE`

17. On the left side menu under `IAM & Admin`, select the `IAM` option
18. Having your service account listed, edit its roles:
    - Click the edit icon on your service account
    - Click `ADD ANOTHER ROLE`
    - Select the `Compute Instance Admin (v1)` role to this email
    - Click `SAVE`

## Generate a service account key

19. On the left side menu under `IAM & Admin`, select the `Service Accounts` option
20. Go to the `Actions` column on your service account, click the three dot menu and choose `Manage keys` option
21. Add a new service account key:
    - Click `ADD KEY` button
    - Select `Create new key` option
    - Pick `JSON` key type
    - Click `CREATE`
22. A JSON file containing your service account credentials will be downloaded, copy its content to your clipboard

## Add credentials to Devopness

23. To add the copied credentials to Devopness, follow the guide [/docs/credentials/add-credential]