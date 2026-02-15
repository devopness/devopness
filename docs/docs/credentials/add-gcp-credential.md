---
title: Add Google Cloud Platform (GCP) Credential
description: Step-by-step guide to configure a Google Cloud service account and required permissions for Devopness.
pagination_next: credentials/add-credential
---

> If you don't have access to a GCP account, you can create an account for free following the cloud provider specific guide [Google Cloud Free Tier](https://cloud.google.com/free)

## Project and API setup

1. Access a GCP project or create a new one: https://console.cloud.google.com/project

   > If you created a new project, a notification modal will appear showing your new project creation status.  
   > Note: It might take a few seconds for the new project to be visible in the project list.  
   > If your new project is not listed a few seconds after its creation, reload the console page.

2. Make sure `Compute Engine API` is enabled on the selected Project:
   - Open **APIs & Services**
   - Click **Enable APIs and Services**
   - Search for **Compute Engine API**
   - Click **Enable** (or **Manage** if already enabled)

3. Make sure `IAM API` is enabled on the selected Project:
   - Open **APIs & Services**
   - Click **Enable APIs and Services**
   - Search for **IAM API**
   - Click **Enable** (or **Manage** if already enabled)

4. Make sure `Cloud Resource Manager API` is enabled on the selected Project:
   - Open **APIs & Services**
   - Click **Enable APIs and Services**
   - Search for **Cloud Resource Manager API**
   - Click **Enable** (or **Manage** if already enabled)

5. Make sure `Cloud Asset API` is enabled on the selected Project:
   - Open **APIs & Services**
   - Click **Enable APIs and Services**
   - Search for **Cloud Asset API**
   - Click **Enable** (or **Manage** if already enabled)

6. Go back to the projects console: https://console.cloud.google.com/project

## Service account setup

7. Open **IAM & Admin > Service Accounts**
8. Make sure a service account named `<project-id>-compute@developer.gserviceaccount.com` is listed

9. If you do not have a service account, create a new one:
   - Click **+ CREATE SERVICE ACCOUNT**
   - Name your new service account
   - Click **DONE**

10. In the **Actions** column, click the three-dot menu on your service account and choose **Manage details**
11. Copy the service account email to your clipboard

## Required IAM roles

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

## Grant Compute Engine Service Agent role

12. Below your service account name, open the **PERMISSIONS** tab
13. Switch to **VIEW BY ROLES**
14. Make sure the service account has the `Compute Engine Service Agent` role

:::note

You may need to enable **Include Google-provided role grants** to see this role.

:::

15. If the role is missing:
   - Click **GRANT ACCESS**
   - Add the service account email as principal
   - Assign the `Compute Engine Service Agent` role
   - Click **SAVE**

16. Open **IAM & Admin > IAM**
17. Edit your service account roles:
   - Click the edit icon
   - Click **ADD ANOTHER ROLE**
   - Add `Compute Instance Admin (v1)`
   - Click **SAVE**

## Generate service account key

18. Open **IAM & Admin > Service Accounts**
19. In the **Actions** column, select **Manage keys**
20. Add a new key:
   - Click **ADD KEY**
   - Select **Create new key**
   - Choose **JSON**
   - Click **CREATE**

21. A JSON file containing the service account credentials will be downloaded

## Add credentials to Devopness

22. To add the copied credentials to Devopness, follow the guide [/docs/credentials/add-credential]
