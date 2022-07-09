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
1. After creating your project, got to GCP IAM manager and select the `Service Accounts` option on the left menu
2. If you already have a service account, jump to step 5
3. Select the `Create Service Account` option
4. Provide the `Cumpute Instance Admin (v1)` and `Service Account Manager` roles to your new service account, and create it
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
