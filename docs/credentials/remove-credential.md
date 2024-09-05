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
        - /docs/credentials/add-credential
    featured:
---

{% note %}

**NOTE**: To remove a credential, it cannot be used by any environment resource. Before removing a credential, you should edit the resources that use the credential you want to remove to use another credential.

{% endnote %}

{% note %}

**NOTE**: In case you need to rotate the credential keys, you can edit the credential. Follow the guide {% mentionPost "/docs/credentials/edit-credential" %}

{% endnote %}

1. On Devopness, navigate to a project and select an environment.
1. Find the `Credentials` card.
1. Click `View` on the `Credentials` card to see a list of existing `Credentials`.
1. In the list of credentials, find the credential you want to remove and click the `NAME` of the credential
1. On the upper-right corner of the credential details view click `REMOVE`
1. Follow the prompts then click `REMOVE`
1. In the list of credentials, the recently removed `Credential` will be gone
