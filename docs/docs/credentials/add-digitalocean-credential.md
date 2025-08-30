---
sidebar_position: 4
title: Add DigitalOcean Credential
intro: In order to allow Devopness to manage DigitalOcean resources on your behalf, API token has to be provided.
links:
    overview:
    quickstart:
    previous: credentials/add-azure-credential
    next: credentials/add-gcp-credential
    guides:
    related:
    featured:
---

> If you don't have access to a DigitalOcean account, you can create an account for free following the cloud provider specific guide [DigitalOcean Free Trial Offer](https://www.digitalocean.com/try/free-trial-offer)

1. Log in to [DigitalOcean Control Panel](https://cloud.digitalocean.com/)
1. In the navigation panel on the left side, click `API`
1. Below the title `Applications & API`, select the `Tokens` tab
1. In the `Tokens` tab, click `Generate New Token`
1. The `New personal access token` form will be displayed
1. Under `Token name`, click `Enter token name` field and type a name for the new token
    - Tip: you might want to name the token as `devopness` to make it easier to track its activities
1. Under `Expiration`, click the `Select token expiry` field and select one of the expiration options for when this token will become expired
1. Under `Select scopes`, ensure the `Write` option is checked
    - It’s critical that your token has the permission to create droplets, otherwise Devopness will be unable to add new Servers.
1. Click `Generate Token`
1. Copy the value of `token`
    - It will be the text prefixed with `dop_v1_`
    - Be sure to record your personal access token. For security purposes, it will not be shown again.
1. To add the copied credentials to Devopness see [/docs/credentials/add-credential]

> For further details on how to create a DigitalOcean token, please refer to [DigitalOcean documentation](https://docs.digitalocean.com/reference/api/create-personal-access-token/)
