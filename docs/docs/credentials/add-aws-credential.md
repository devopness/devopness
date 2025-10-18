---
title: Add Amazon Web Services (AWS) Credential
intro: In order to allow Devopness to manage AWS resources on your behalf, IAM user security credentials have to be provided.
links:
    overview:
    quickstart:
    previous:
    next: credentials/add-credential
    guides:
    related:
    featured:
---

> If you don't have access to an AWS account, you can create an account for free following the cloud provider specific guide [AWS Free Tier](https://aws.amazon.com/free/)

1. Log in to AWS console and access [AWS IAM](https://console.aws.amazon.com/iam/)
<img src="/img/aws-credential-screenshots/step-3.png" alt="AWS IAM Console" style="margin-top: 15px; margin-bottom: 40px;" />
1. In the navigation pane on the left side, choose `Users` and then choose `Create user`
<img src="/img/aws-credential-screenshots/step-4.png" alt="Create new user" style="margin-top: 15px; margin-bottom: 40px;" />
1. Type the user name for the new user and click `Next`. Tip: you might want to name the user as `devopness` to make it easier to track its activities
<img src="/img/aws-credential-screenshots/step-5.png" alt="User details" style="margin-top: 15px; margin-bottom: 40px;" />
1. In the `Set Permissions` step click `Attach policies directly`
<img src="/img/aws-credential-screenshots/step-6.png" alt="Set permissions" style="margin-top: 15px; margin-bottom: 40px;" />
1. Search and select the policies `AmazonEC2FullAccess`
<img src="/img/aws-credential-screenshots/step-7.png" alt="Set EC2 permission" style="margin-top: 15px; margin-bottom: 40px;" />
1. and `IAMReadOnlyAccess`
<img src="/img/aws-credential-screenshots/step-8.png" alt="Set IAM permission" style="margin-top: 15px; margin-bottom: 40px;" />
1. Follow the prompts then click `Create user`
<img src="/img/aws-credential-screenshots/step-9.png" alt="Create user" style="margin-top: 15px; margin-bottom: 40px;" />
1. In the `Users` list, click the username link of the user you've just created
<img src="/img/aws-credential-screenshots/step-10.png" alt="List of users" style="margin-top: 15px; margin-bottom: 40px;" />
1. Navigate to the `Security credentials` tab
<img src="/img/aws-credential-screenshots/step-11.png" alt="Security credentials tab" style="margin-top: 15px; margin-bottom: 40px;" />
1. In this page, scroll down to the `Access keys` section and click `Create access key`
<img src="/img/aws-credential-screenshots/step-12.png" alt="Access key" style="margin-top: 15px; margin-bottom: 40px;" />
1. Choose `Other` and click `Next`
<img src="/img/aws-credential-screenshots/step-13.png" alt="Create key" style="margin-top: 15px; margin-bottom: 40px;" />
1. Give the key a description (Optional) and click 'Next' and click `Create access key`
<img src="/img/aws-credential-screenshots/step-14.png" alt="Description key" style="margin-top: 15px; margin-bottom: 40px;" />
1. Copy the values of `Access key ID` and `Secret access key`
<img src="/img/aws-credential-screenshots/step-15.png" alt="Create user" style="margin-top: 15px; margin-bottom: 40px;" />
1. To add the copied credentials to Devopness see [/docs/credentials/add-credential]
