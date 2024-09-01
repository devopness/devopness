---
title: Add a Credential
intro: Devopness allows you to manage multiple provider accounts from a single platform. Add Cloud/Source Provider Credentials to your Devopness account to provision and manage cloud infrastructure resources and deploy your applications with increased productivity.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - /docs/credentials/add-aws-credential
        - /docs/credentials/add-digitalocean-credential
        - /docs/credentials/add-gcp-credential
        - /docs/credentials/remove-credential
    featured:
---

1. On Devopness, navigate to a project and select an environment.
1. Find the `Credentials` card.
1. Click `View` on the `Credentials` card to see a list of existing `Credentials`.
1. In the upper-right corner of the list, click `ADD CREDENTIAL`.
1. On the `Select a Credential provider` step, you will see cards with supported providers.
1. If you are adding a source provider credential:
    1. Select the card for your source provider and click the `Next` button.
    1. Click the `Confirm` button.
    1. You will be redirected to the source provider's authentication screen.
    1. Log in to your source provider account and authorize access for this environment.
1. If you are adding a cloud provider credential:
    1. Select the card for your cloud provider and click the `Next` button.
    1. Provide a name for your new `Cloud Provider Credential`. For example, "Company X Cloud Provider Key".
    1. Follow the cloud provider-specific instructions to obtain the credentials for the chosen cloud provider.
        - See the related posts section for cloud provider-specific instructions.
    1. Paste your credentials into the appropriate fields in the form.
    1. Click `CONFIRM`.
