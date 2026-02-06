---
title: Remove a Credential
intro: Learn how to remove a credential when it's no longer needed
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - credentials/add-credential
    featured:
---

:::note

In case you need to rotate credential keys, you can edit a credential instead of removing a credential and create a new one. To edit a credential, follow the guide [/docs/credentials/edit-credential]

:::

:::warning

If you are really sure you want to remove a credential, that cannot be done if the credential to be removed is currently in use by any environment resource.
To remove a credential that is currently in use you should edit each resource using that credential to use another credential.

:::

1. On Devopness, navigate to a project and select an environment.
1. Find the `Credentials` card.
1. Click `View` on the `Credentials` card to see a list of existing `Credentials`.
1. In the list of credentials, find the credential you want to remove and click the `NAME` of the credential
1. On the upper-right corner of the credential details view click `REMOVE`
1. Follow the prompts then click `REMOVE`
1. In the list of credentials, the recently removed `Credential` will be gone
