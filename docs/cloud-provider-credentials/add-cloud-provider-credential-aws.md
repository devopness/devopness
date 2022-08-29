---
title: Add AWS Credential
intro: In order to allow Devopness to manage Amazon Web Services (AWS) resources on your behalf, IAM user security credentials have to be provided.
links:
    overview:
    quickstart:
    previous:
    next:
        - /docs/cloud-provider-credentials/add-cloud-provider-credential
    guides:
    related:
    featured:
---

# Get AWS Credentials

1. Create a new user with programmatic access, following instructions on [AWS IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)
> Tip: you might want to name the user as `devopness` to make it easier to track its activities in the future
1. With the user already created, access [AWS IAM console](https://console.aws.amazon.com/iam/)
1. Click `Users` on the left side menu under `Access management`
1. Locate the existing user and click the value in the `User name` column
1. Click the `Security credentials` tab
1. Click `Create access key`
1. Read the instructions, click the `Show` link and then select and copy the `Secret access key`
1. Make sure to keep your
1. Having your `Access key ID` and `Secret access key`, add the credentials to Devopness by following the [Add a Cloud Provider Credential](../add-cloud-provider-credential) guide.
