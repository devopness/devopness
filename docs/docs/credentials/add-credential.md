---
title: Add a Credential
intro: Devopness allows you to manage multiple provider accounts from a single platform. Add Cloud Provider and Source Provider credentials to your environment to allow you and your team to provision, manage cloud infrastructure resources and deploy your applications with increased productivity.
links:
    overview:
    quickstart:
    previous: credentials/index
    next:
    guides:
    related:
        - credentials/add-aws-credential
        - credentials/add-azure-credential
        - credentials/add-digitalocean-credential
        - credentials/add-gcp-credential
        - credentials/remove-credential
    featured:
---

1. On Devopness, navigate to a project and select an environment.
1. Find the `Credentials` card.
1. Click `View` on the `Credentials` card to see a list of existing `Credentials`.
1. In the upper-right corner of the list, click `ADD CREDENTIAL`.
1. Follow the prompts and click `CONFIRM`
1. In the `Credential` details view, the recently created `Credential` details can be seen

## Choose the right credential

For team workflows, use a shared automation account instead of a personal account. This keeps access consistent and avoids tying deployments to one person.

Example for a source provider (for example GitHub):
1. Create a dedicated user (for example `devopness` or `devopness-<org>`)
1. Add it to your organization or repositories with the minimum permissions needed
1. Create a personal access token or SSH key for that user
1. Add the credential in Devopness

Devopness also supports other source providers (for example GitLab or Bitbucket).

For cloud providers, you can add multiple credentials as needed (for example AWS, Azure, GCP, DigitalOcean, Hetzner). Use different credentials if you want to keep access separate between projects or teams.
