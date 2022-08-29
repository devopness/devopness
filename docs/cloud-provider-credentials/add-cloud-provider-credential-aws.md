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

1. Log in to AWS console and access [AWS IAM](https://console.aws.amazon.com/iam/)
1. In the navigation pane on the left side, choose `Users` and then choose `Add users`
1. Type the user name for the new user
    > Tip: you might want to name the user as `devopness` to make it easier to track its activities
1. Check the option `Access key - Programmatic access`
1. Uncheck the option `Password - AWS Management Console access`
1. Click `Next: Permissions`
1. In the `Set Permissions` step click `Attach existing policies directly`
1. Search and select the policies `AmazonEC2FullAccess` and `IAMReadOnlyAccess`
1. Follow the prompts then click `Create user`
1. Copy the values of `Access key ID` and `Secret access key`
1. To add the copied credentials to Devopness see [Add a Cloud Provider Credential](../add-cloud-provider-credential)
