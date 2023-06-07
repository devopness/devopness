---
title: Add Amazon Web Services (AWS) Credential
intro: In order to allow Devopness to manage AWS resources on your behalf, IAM user security credentials have to be provided.
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

> If you don't have access to an AWS account, you can create an account for free following the cloud provider specific guide [AWS Free Tier](https://aws.amazon.com/free/)

1. Log in to AWS console and access [AWS IAM](https://console.aws.amazon.com/iam/)
1. In the navigation pane on the left side, choose `Users` and then choose `Add users`
1. Type the user name for the new user
    > Tip: you might want to name the user as `devopness` to make it easier to track its activities
1. Click `Next: Permissions`
1. In the `Set Permissions` step click `Attach policies directly`
1. Search and select the policies `AmazonEC2FullAccess` and `IAMReadOnlyAccess`
1. Follow the prompts then click `Create user`
1. In the `Users` list, click the username link of the user recently created
1. Click `Security credentials`
1. In this page, search for `Access keys` section and click `Create access key`
1. Choose `Other` and click `Next`
1. Click `Create access key`
1. Copy the values of `Access key ID` and `Secret access key`
1. To add the copied credentials to Devopness see [Add a Cloud Provider Credential](../add-cloud-provider-credential)
