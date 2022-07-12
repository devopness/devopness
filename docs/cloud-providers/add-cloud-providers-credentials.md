---
title: Add a Cloud Provider Credential
intro: Devopness allows you to manage multiple Cloud Providers accounts from a single platform.
Add Cloud Providers Credentials to your Devopness account to provision and manage cloud infrastructure resources with increased productivity.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - /docs/cloud-providers/remove-cloud-providers-credentials
    featured:
---

# Generating Cloud Providers Credentials
## GCP Service Account Credentials
1. Access your GCP project or [create a new project on GCP](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
2. Select the `Service Accounts` option under `IAM & Admin` on the navigation menu
3. If you do not have a service account, follow [instructions on GCP docs to create a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
4. Provide the `Cumpute Instance Admin (v1)` and `Service Account Manager` roles to your service account
5. To your choosen service account, select the `Manage keys` option
6. Select the `ADD KEY -> Create new key -> JSON`
7. A JSON file containing your service account credentials will be downloaded, it's content will be the input to Devopness Cloud Credentials form field

# Add a Cloud Provider Credential
1. In the upper-right corner of any page, click your profile icon then click `Cloud Providers`
    - A list of existing Cloud Providers Credentials will be displayed
2. On the upper-right corner of the list, click `ADD CLOUD PROVIDER`
3. Use the drop-down menu to choose a Cloud Provider
4. Provide a name to your new `Cloud Provider Credential`. For example, "Company X cloud provider key"
5. Paste in your credentials to the appropriate fields in the form
6. Click `CONFIRM`
