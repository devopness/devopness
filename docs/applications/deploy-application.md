---
title: Deploy application
intro: Deploy your code changes in smaller chunks to make it easier to validate the code through build and testing pipelines, reducing the feedback loop on error detection. Learn how to use Devopness to deploy application changes confidently, with zero downtime, using your own custom build pipelines and make sure your users can benefit from your application as soon as possible. The more often you deploy your application, the better it tends to improve.
links:
    overview:
    quickstart:
    previous:
        - /docs/configuration-files/add-configuration-file
    next:
        - /docs/roles/add-role
    guides:
    related:
    featured:
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. Click `DEPLOY` on the application you want to deploy
1. Choose the branch and the pipeline to be deployed, then click `Next`
1. Review deploy information then click `Confirm`
   > A notification popup will be displayed, confirming that the deployment has been triggered
1. Wait for the `Application:Deploy` action to be completed
