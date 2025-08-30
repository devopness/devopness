---
sidebar_position: 3
title: Deploy Application
intro: Deploy your code changes in smaller chunks to make it easier to validate the code through build and testing pipelines, reducing the feedback loop on error detection. Learn how to use Devopness to deploy application changes confidently, with zero downtime, using your own custom build pipelines and make sure your users can benefit from your application as soon as possible. The more often you deploy your application, the better it tends to improve.
links:
    overview:
    quickstart:
    previous: applications/edit-application
    next: applications/deploy-application-using-incoming-hook
    guides:
    related:
    featured:
required_permissions:
    - application:deploy
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. Click `DEPLOY` on the application you want to deploy
1. Follow the prompts, then click `Next`
1. Review deploy information then click `Confirm`
   > A notification popup will be displayed, confirming that the deployment has been triggered
1. Wait for the `Application:Deploy` action to be completed

:::note

Now that your application has been deployed, it can be accessed over the internet by setting up a DNS record, or testing access to the application via server IP address.

- For details on how to make an application public, follow the instructions in [/docs/virtual-hosts/add-virtual-host].

:::
