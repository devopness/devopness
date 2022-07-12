---
title: Generate Google Service Account Credentials
intro: In order to allow Devopness to manage Google Cloud resources for you, you need to provide us Service Account Credentials.
links:
    overview:
      - /docs/cloud-providers/credentials/index
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

# Generate Service Account Credentials

1. Access your GCP project or [create a new project on GCP](https://cloud.google.com/resource-manager/docs/creating-managing-projects) on Google Cloud console
2. Select the `Service Accounts` option under `IAM & Admin` on the navigation menu
3. If you do not have a service account, follow [instructions on GCP docs to create a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
4. Provide the `Cumpute Instance Admin (v1)` and `Service Account Manager` roles to your service account
5. To your choosen service account, select the `Manage keys` option
6. Select the `ADD KEY -> Create new key -> JSON`
7. A JSON file containing your service account credentials will be downloaded, it's content will be used as input to Devopness Cloud Credentials form field
